# Planhigh CRM API Testing Guide

Base URL: `http://localhost:5000/api`

## 1. Authentication (First Step)
You must login to get a **JWT Token**. You will need this token for all other requests.

### **Login**
- **Method**: `POST`
- **URL**: `{{baseUrl}}/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "admin@planhigh.com",
    "password": "password123"
  }
  ```
- **Response**: Copy the `token` string from the response.

### **Set Token in Postman**
1. Go to the **Authorization** tab of your request (or Collection).
2. Select Type: **Bearer Token**.
3. Paste the token you copied.

---

## 2. Dashboard
- **Get Stats**
  - **Method**: `GET`
  - **URL**: `{{baseUrl}}/dashboard/stats`
- **Get Activity Feed**
  - **Method**: `GET`
  - **URL**: `{{baseUrl}}/dashboard/activity`

---

## 3. Properties

### **List Properties**
- **Method**: `GET`
- **URL**: `{{baseUrl}}/properties`
- **Query Params** (Optional): `?type=Office&status=Sale`

### **Create Property** (Admin/Agent Only)
- **Method**: `POST`
- **URL**: `{{baseUrl}}/properties`
- **Body** (JSON):
  ```json
  {
    "title": "Modern Tech Park",
    "type": "Office",
    "status": "Lease",
    "inventoryStatus": "Active",
    "source": "Direct",
    "location": "Electronic City, Bangalore",
    "size": "15000 sqft",
    "price": "12 Lakh/month",
    "images": ["https://example.com/image1.jpg"]
  }
  ```

### **Get Single Property**
- **Method**: `GET`
- **URL**: `{{baseUrl}}/properties/:id`
- Replace `:id` with a UUID from the List Properties response.

---

## 4. Contacts

### **List Contacts**
- **Method**: `GET`
- **URL**: `{{baseUrl}}/contacts`

### **Create Contact**
- **Method**: `POST`
- **URL**: `{{baseUrl}}/contacts`
- **Body** (JSON):
  ```json
  {
    "name": "Rajesh Gupta",
    "phone": "9988776655",
    "type": "Investor",
    "companyName": "Gupta Ventures",
    "location": "Delhi",
    "remark": "Looking for high ROI assets"
  }
  ```
