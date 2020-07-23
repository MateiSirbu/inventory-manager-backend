import * as aJsonData from "../data/a-json.data";

const getAJson = function () {
	// get the data from the persistence; this can be from memory, a file on disk, a db
	// validate data, aggregate it, return it
	return aJsonData.getAJson();
}

export { getAJson }