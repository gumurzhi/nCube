### /user/add POST

expects:
```JSON
{
	"username": "user",
	"password": "123"
}
```
success answer: "ok"
___

### /candidate/add POST

expects:
```JSON
{
	"name": "c2"
}
```
success answer:
```JSON
{
  "__v": 0,
  "name": "c3",
  "_id": "58a527d9e4da1214a07e2416"
}
```
___

### /login POST

expects:
```JSON
{
	"username": "user",
	"password": "123"
}
```
success answer:
"loggedIn"
___

### /logout GET

___

### /user/addVote POST

expects:
```JSON
{
	"candidateId": "58a507798314f75fbf3865eb"
}
```
success answer:
"OK"
___

### /candidate/getAll GET

expects: {}
success answer:
```JSON
[
  {
    "_id": "58a507798314f75fbf3865eb",
    "name": "c2",
    "numOfVotes": 3
  },
  {
    "_id": "58a5076f8314f75fbf3865ea",
    "name": "c1",
    "numOfVotes": 1
  }
]
```