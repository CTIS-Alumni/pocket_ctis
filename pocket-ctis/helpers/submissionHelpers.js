import {cloneDeep, findIndex, isEqual, pick} from "lodash";

export const splitFields = (data, fields) => {
    //splits field into name and id values
    fields.forEach((field) => {
        if (data.hasOwnProperty(field) && data[field] != null && data[field] != "null-null") {
            const splitData = data[field].split("-");
            data[field + "_id"] = parseInt(splitData[0]);
            data[field + "_name"] = splitData[1];
        }
        delete data[field];
    });
}

export const replaceWithNull = (data) => {
    Object.keys(data).forEach((field) => {
        if (data[field] === "")
            data[field] = null;
    });
}

export const isEqualFields = (data, compared_data, fields, name_id_pair, toOmitFomData, toOmitFromCompared, has_date) => {
    fields.forEach((field) => {
        if (!data.hasOwnProperty(field))
            data[field] = null;
    });
    name_id_pair.forEach((field)=>{
        if(!data.hasOwnProperty(field + "_id"))
            data[field + "_id"] = null;
        delete data[field + "_name"];
    });

    if(has_date){
        if(data.start_date)
            data.start_date = data.start_date.slice(0,7);
        if(data.end_date)
            data.end_date = data.start_date.slice(0,7);
        if(compared_data.start_date)
            compared_data.start_date = compared_data.start_date.slice(0,7);
        if(compared_data.end_date)
            compared_data = compared_data.start_date.slice(0,7);
    }
    return isEqual(omitFields(data, toOmitFomData), omitFields(compared_data, toOmitFromCompared));
}

export const convertToLastDay = (date) => {
    const tempDate = new Date(new Date(date).getTime() + 86400000);
    const splitDate = tempDate.toISOString().split("-");
    return new Date(parseInt(splitDate[0]), parseInt(splitDate[1])).toISOString();
}

export const omitFields = (obj, fields) => {
    let keys_list = Object.keys(obj);
    keys_list = keys_list.filter(key => !fields.includes(key));
    return pick(obj, keys_list);
}

export const submissionHandler = (req, res, values, name, args, transformForSubCallback, transformCallback,data) => {
    req.DELETE.forEach((toDelete)=>{
        if(!res.DELETE.data?.hasOwnProperty(toDelete.id)){
            values[name].push(toDelete.data);
        }
    });

    if(req.POST.length > 0){
        req.POST.forEach((toInsert)=>{
            const cloned_values = cloneDeep(values);
            transformForSubCallback(cloned_values);
            const index = findIndex(cloned_values[name], (item) => {
                return isEqual(item, toInsert);
            });
            if(index != -1){
                const found_in_res = res.POST.data?.find(datum =>
                    isEqualFields(toInsert, datum.inserted, args[0], args[1], args[2], args[3], args[4])
                );
                if(found_in_res === undefined)
                    values[name].splice(index, 1);
                else values[name][index].id = found_in_res.inserted.id;
            }
        });
    }

    if(req.PUT.length > 0){
        console.log("hers the data that comes to put", data);
        const temp_data = {};
        temp_data[name] = data;
        transformForSubCallback(temp_data);
        req.PUT.forEach((toEdit) => {
            if(!res.PUT.data.hasOwnProperty(toEdit.id)){
                const index = findIndex(values[name], (item) => {
                    return item.id == toEdit.id;
                });
                console.log("heres the index", index)
                if(index != -1){
                    const found = temp_data[name].find(datum => datum.id === toEdit.id);
                    console.log("heres found", found);
                    if(found != undefined){
                        let temp = [];
                        temp[0] = found;
                        temp = transformCallback(temp);
                        values[name][index] = temp[0];
                    }
                }
            }
        });
    }
    const values_afer_submission = cloneDeep(values);
    return values_afer_submission;
}