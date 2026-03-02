function normalizeQuery(query){

if(!query) return "";

query = query.toLowerCase();

/* remove numbers */
query = query.replace(/\d+/g,"");

/* remove marketing keywords */
query = query
.replace("pro","")
.replace("max","")
.replace("ultra","")
.replace("plus","");

query = query.trim();

/* intent detection */

if(query.includes("iphone"))
return "iphone";

if(query.includes("samsung"))
return "samsung";

if(query.includes("laptop"))
return "laptop";

return query;
}

module.exports = normalizeQuery;