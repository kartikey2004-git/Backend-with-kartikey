# MongoDB Operators Master Cheatsheet

## Comparison Operators

$eq: Matches values that are equal to a specified value.
$ne: Matches values that are not equal.
$gt: Matches values greater than a specified value.
$gte: Matches values greater than or equal.
$lt: Matches values less than a specified value.
$lte: Matches values less than or equal.
$in: Matches any value in an array.
$nin: Matches any value not in an array.

## Logical Operators

$and: Joins query clauses with AND logic.
$or: Joins query clauses with OR logic.
$not: Inverts the effect of a query expression.
$nor: Joins query clauses with NOR logic.

## Element Operators

$exists: Checks if a field exists (true/false).
$type: Checks the BSON type of the field.

## Evaluation Operators

$expr: Allows use of aggregation expressions inside queries.
$mod: Matches documents where field % divisor == remainder.
$regex: Matches strings using regex.
$text: Performs text search.
$where: Matches documents that satisfy JS expression.

## Array Operators

$all: Matches arrays that contain all specified elements.
$elemMatch: Matches array with at least one matching element.
$size: Matches arrays with specified length.


## Update Field Operators

$set: Sets the value of a field.
$unset: Removes the specified field.
$inc: Increments a field.
$mul: Multiplies the value of a field.
$min: Sets field only if new value is less.
$max: Sets field only if new value is greater.
$rename: Renames a field.
$currentDate: Sets field to current date.

## Update Array Operators

$addToSet: Adds to array only if not present.
$pop: Removes first or last element.
$pull: Removes all matching elements.
$push: Adds value to array.
$pullAll: Removes all matching values from array.

## Aggregation Pipeline Operators (Stage)

$match: Filters documents.
$group: Groups data.
$project: Reshapes fields.
$sort: Sorts documents.
$limit: Limits number of docs.
$skip: Skips docs.
$lookup: Joins documents from another collection.
$unwind: Deconstructs arrays.

## Bitwise Operators

$bitsAllClear: Matches numeric values where all given bit positions are clear (0).
$bitsAllSet: Matches numeric values where all given bit positions are set (1).
$bitsAnyClear: Matches numeric values where any given bit position is clear (0).
$bitsAnySet: Matches numeric values where any given bit position is set (1).


## Geospatial Query Operators

$geoWithin: Matches geometries within a certain area.
$geoIntersects: Matches geometries that intersect.
$near: Returns docs ordered by distance.
$nearSphere: Returns spherical distance ordered docs.

## Projection Operators

$: Projects first matching element from an array.
$elemMatch: Projects matching array elements.
$meta: Projects metadata (e.g., textScore).
$slice: Limits number of array elements returned.

## Aggregation Expression Operators

$add: Adds numbers.
$subtract: Subtracts two numbers.
$multiply: Multiplies numbers.
$divide: Divides numbers.
$mod: Calculates remainder (modulus).

## String Aggregation Operators

$concat: Concatenates strings.
$substr: Returns substring.
$toLower: Converts string to lowercase.
$toUpper: Converts string to uppercase.
$strLenCP: Returns length in code points.

## Date Aggregation Operators

$year: Returns year from date.
$month: Returns month from date.
$dayOfMonth: Returns day of month.
$hour: Returns hour from date.
$minute: Returns minute from date.
$second: Returns second from date.


## Conditional Operators

$cond: If-then-else conditional operator.
$ifNull: Returns alternate if expression is null or missing.


