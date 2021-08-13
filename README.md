# Seat 7 Online
Plataforma Seat 7 Online: Front-end 


## Git da API
#https://github.com/ekbaumgarten/seat7

### A API está rodando no heroku
https://seat7.herokuapp.com/api


## Rodar projeto
npm start

### Rodar projeto em uma porta diferente
port=3002 npm start


# Actions
OBS.: For 1 and 2 the access token isn't required. For the other methods, send access token in Authorization header field.

#### 1 - LOGIN
POST api/app_users/login
BODY {  
&nbsp;&nbsp;&nbsp;&nbsp;"email":"email@user.com",  
&nbsp;&nbsp;&nbsp;&nbsp;"password": "userpwd"  
}

#### 2 - USER (company) REGISTER
POST api/app_users/user_company  
BODY {  
&nbsp;&nbsp;&nbsp;&nbsp;"name": "User Name",  
&nbsp;&nbsp;&nbsp;&nbsp;"email": "email@user.com",  
&nbsp;&nbsp;&nbsp;&nbsp;"password": "userpwd",  
&nbsp;&nbsp;&nbsp;&nbsp;"company_name": "User Company Name"  
}

#### 3 - USERDATA UPDATE
PUT api/app_users/:user_id Ex.:api/app_users/10  
BODY {  
&nbsp;&nbsp;&nbsp;&nbsp;"name": "User Name",  
&nbsp;&nbsp;&nbsp;&nbsp;"email": "email@user.com",  
&nbsp;&nbsp;&nbsp;&nbsp;"company_name": "User Company Name"  
}  

#### 4 - GET USERDATA
GET api/app_users/:user_id?filter[include]=companies  

#### 5 - CHANGE PASSWORD
POST api/app_users/change-password  
BODY {  
&nbsp;&nbsp;&nbsp;&nbsp;"oldPassword": "oldUserPassword",  
&nbsp;&nbsp;&nbsp;&nbsp;"newPassword": "newUserPassword"  
}  

#### 6 - LOGOUT
POST api/app_users/logout

#### 7 - ACTIVATE USER
GET api/app_users/:user_id/activate

#### 8 - DEACTIVATE USER
GET api/app_users/:user_id/deactivate

#### 9 - DELETE USER - This will delete all user history (projects, etc.)
DELETE api/app_users/:user_id

#### 10 - GET ALL PUBLISHERS
GET api/publishers

#### 11 - GET PUBLISHER DATA
GET api/publishers/:id

#### 12 - INSERT PUBLISHER
POST api/publishers  
BODY {  
&nbsp;&nbsp;&nbsp;&nbsp;"name": "Publisher Name",  
&nbsp;&nbsp;&nbsp;&nbsp;"email": "optional@emailaddres.com",  
&nbsp;&nbsp;&nbsp;&nbsp;"phone": "Optional phone",  
&nbsp;&nbsp;&nbsp;&nbsp;"active": true|false  
}

#### 13 - UPDATE PUBLISHER
PUT api/publishers/:id  
BODY {  
&nbsp;&nbsp;&nbsp;&nbsp;"name": "Publisher Name",  
&nbsp;&nbsp;&nbsp;&nbsp;"email": "optional@emailaddress.com",  
&nbsp;&nbsp;&nbsp;&nbsp;"phone": "Optional phone",  
&nbsp;&nbsp;&nbsp;&nbsp;"active": true|false  
}

#### 14 - DELETE PUBLISHER
DELETE api/publishers/:id  

#### 15 - GET ALL PUBLISHER EMPLOYEES
GET api/publishers/:publisher_id/employees

#### 16 - GET PUBLISHER EMPLOYEE DATA
GET api/publishers/:publisher_id/employees/:employee_id

#### 17 - INSERT PUBLISHER EMPLOYEE
POST api/publishers/:publisher_id/employees
BODY {  
&nbsp;&nbsp;&nbsp;&nbsp;"name": "Employee Name",  
&nbsp;&nbsp;&nbsp;&nbsp;"email": "employee_email@test.com",  
&nbsp;&nbsp;&nbsp;&nbsp;"office_post": "Optional office/post"  
}

#### 18 - UPDATE PUBLISHER EMPLOYEE
PUT api/publishers/:publisher_id/employees/:employee_id  
BODY {  
&nbsp;&nbsp;&nbsp;&nbsp;"name": "Employee Name",  
&nbsp;&nbsp;&nbsp;&nbsp;"email": "employee_email@test.com",  
&nbsp;&nbsp;&nbsp;&nbsp;"office_post": "Optional office/post"  
}

#### 19 - DELETE PUBLISHER EMPLOYEE
DELETE api/publishers/:publisher_id/employees/:employee_id