import {cloneDeep, findIndex, isEqual, pick} from "lodash";
//this file has functions that help with preparing the raw data in the submit forms for submission

export const splitFields = (data, fields) => {
    //splits field into name and id values
    //data usually comes in this form: university: 19-Bilkent (id-name)
    fields.forEach((field) => {
        if (data.hasOwnProperty(field) && data[field] != null && data[field] != "null-null") {
            const splitData = data[field].split("-");
            data[field + "_id"] = parseInt(splitData[0]);
            data[field + "_name"] = splitData[1];
        }else if(data.hasOwnProperty(field)){
            data[field + "_id"] = null;
            data[field + "_name"] = null;
        }
        delete data[field];
    });
}

export const replaceWithNull = (data) => {
    Object.keys(data).forEach((field) => {
        if (typeof data[field] === "string") {
            data[field] = data[field].trim();
            if (data[field] === "" || data[field] === undefined || data[field] === "null") {
                data[field] = null;
            }
        }
    });
}

//deep compares 2 objects but with the option to omit optional data from either/both objects
export const isEqualFields = (data, compared_data, name_id_pair, toOmitFromData, toOmitFromCompared, has_date) => {
    name_id_pair.forEach((field)=>{
        if(!data.hasOwnProperty(field + "_id"))
            data[field + "_id"] = null;
        delete data[field + "_name"]; // name unnecessary for comparison so delete
    });

    has_date.forEach((date_field) => {//the same date coming from db and going to db has different timezone values so convert to date first
        if(data.hasOwnProperty(date_field)){
            const new_date = new Date(data[date_field]).toString();
            const split = new_date.split(" ");
            data[date_field] = split[1] + " " +split[2] + " " + split[3];
        }
        if(compared_data.hasOwnProperty(date_field)){
            const new_date = new Date(compared_data[date_field]).toString();
            const split = new_date.split(" ");
            compared_data[date_field] = split[1] + " " +split[2] + " " + split[3];
        }
    })
    return isEqual(omitFields(data, toOmitFromData), omitFields(compared_data, toOmitFromCompared));
}


export const convertToIso = (date) => {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}


//need this because lodash omit will be obsolete
export const omitFields = (obj, fields) => {
    let keys_list = Object.keys(obj);
    keys_list = keys_list.filter(key => !fields.includes(key));
    return pick(obj, keys_list);
}

export const handleResponse = (original_data, req, res, values, name, args, transformForSubCallback) => {//values = current data in form //name = object name
    req.DELETE.forEach((toDelete)=>{
        if(!res.DELETE.data?.hasOwnProperty(toDelete.id)){//if delete response has error, restore the record back in form
            values[name].push(toDelete.data);
        }
    });
    const cloned_values = cloneDeep(values);
    transformForSubCallback(cloned_values);
    if(req.POST.length > 0){
        req.POST.forEach((toInsert)=>{
            const index = findIndex(cloned_values[name], (item) => {
                return isEqual(item, toInsert);
            });
            if(index !== -1){
                const found_in_res = res.POST.data?.find(datum => { // find the index of the id'less version of the data in the form
                      return isEqualFields(toInsert, datum.inserted, args[0], args[1], args[2], args[3]);
                    });
                if(found_in_res !== undefined){//attach the insert_id's back to records in the form so that you can edit them immediately without refetching data
                    if(!values[name][index].hasOwnProperty("id")){
                        values[name][index].id = found_in_res.inserted.id;
                    }
                }
            }
        });
    }
    let send_back_to_form = values;
    if(req.PUT.length > 0){
        send_back_to_form = cloneDeep(values); //the current value in the form & the data to be set in state will be different so clone it
        req.PUT.forEach((toEdit) => {
           if(!res.PUT.data?.hasOwnProperty(toEdit.id)){//if put response has error
               const index_in_values = findIndex(cloned_values[name], (item) => {
                   return item.id === toEdit.id;
               });
               const index_in_original = findIndex(original_data, (item) => {
                   return item.id === toEdit.id;
               });
               if(index_in_original !== -1 && index_in_values !== -1) // if we dont do this, the func will return errored data to set as dataAfterSubmit, which shouldnt happen
                   send_back_to_form[name][index_in_values] = original_data[index_in_original];
           }
        });
    }

    return cloneDeep(send_back_to_form[name]);
}
