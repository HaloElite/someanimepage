import { cloneDeep } from 'lodash';


const sortObjectArrayByName = (objectArray, enumtype) => {
    var workingCopy = cloneDeep(objectArray);

    if (enumtype === "asc") {
        workingCopy.sort((a, b) => (a.title > b.title) ? 1 : -1)
    } else if (enumtype === "desc") {
        workingCopy.sort((a, b) => (a.title < b.title) ? 1 : -1)
    }
    
    return workingCopy;
}


const sortObjectArrayByStartDate = (objectArray, enumtype) => {
    var workingCopy = cloneDeep(objectArray);
    console.log(workingCopy);

    if (enumtype === "asc") {
        workingCopy.sort((a, b) => (a.airing_start > b.airing_start) ? 1 : -1)
    } else if (enumtype === "desc") {
        workingCopy.sort((a, b) => (a.airing_start < b.airing_start) ? 1 : -1)
    }
    
    return workingCopy;
}

export { sortObjectArrayByName, sortObjectArrayByStartDate };