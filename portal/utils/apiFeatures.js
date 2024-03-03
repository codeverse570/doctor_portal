class apiFeatures {
    constructor(query, queryString) {
        this.tours = query
        this.queryString = queryString
        console.log(queryString)
    }
    filter() {
        let queryobj = this.queryString;
        // queryobj=JSON.stringify(queryobj)
        queryobj = queryobj.replace(/\b{gte|gt|lte|lt}\b/g, match => `$${match}`)
        queryobj = JSON.parse(queryobj)
        let subquery = { ...queryobj }
        const fil = ["sort", "limit", "fields", "limit", "page"]
        fil.forEach(obj => delete subquery[obj])
        this.tours.find(subquery)
        return this
    }
    sort() {
        let queryobj = JSON.parse(this.queryString)
        if (queryobj.sort)
            this.tours = this.tours.sort(queryobj.sort.replace(',', " "))
        return this;
    }
    fields() {
        let queryobj = JSON.parse(this.queryString)
        console.log(queryobj.fields)
        if (queryobj.fields) {
          
            this.tours = this.tours.select(queryobj.fields.replaceAll(",", " "))
        }
        else {
            this.tours = this.tours.select("-__v")
        }
        return this;
    }
    paging() {
        let queryobj = JSON.parse(this.queryString)
        if (queryobj.page) {
            let page = queryobj.page * 1
            let limit = queryobj.limit * 1
            let skip = (page - 1) * limit

            this.tours = this.tours.skip(skip).limit(limit)
        }
        return this
    }


}
module.exports = apiFeatures;