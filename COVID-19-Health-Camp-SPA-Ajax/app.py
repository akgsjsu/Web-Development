import imp
from unittest import result
from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
import json
import sqlite3 as sql
from sqlite3 import Cursor, Error

DB_PATH = r"C:\Users\vaibh\Desktop\SJSU\3Sem\280\Assignments\COVID-19-Health-Camp-SPA-Ajax\DB\covid.db"
CREATE_TABLE_SQL = """ CREATE TABLE IF NOT EXISTS patients (
                                        name varchar(50),
                                        gender varchar(6),
                                        age int,
                                        medications text,
                                        notes text,
                                        photo blob,
                                        vaccinationCertificate blob
                                    ); """

app = Flask(__name__)
CORS(app)

@app.route('/', methods = ['GET'])
def home():
	return render_template('covidPortal.html')

@app.route('/save-data',methods = ['POST'])
def saveData():
   body = request.get_json()
   db_connect = create_connection(DB_PATH)
   if db_connect is not None:
      print("DB Connection Successful,Trying Saving Data")
      # create projects table
      create_table(db_connect, CREATE_TABLE_SQL)
      insert_data(db_connect, body)
   else:
      return "DB Connection Failed"
   # print(body)
   return "success"

@app.route('/retrieve-data')
def getData():
   conn = sql.connect(DB_PATH)
   cursor = conn.cursor()
   cursor.execute("select * from patients")
   patient_data = cursor.fetchall()
   dict_data = [dict((cursor.description[i][0], value) \
               for i, value in enumerate(row)) for row in patient_data]
   # print(r)
   conn.close()
   # print(patient_data)
   return (json.dumps(dict_data))


def create_connection(db_file):
   conn = None
   try:
      conn = sql.connect(db_file)
   except Error as e:
      print(e)
   return conn

def create_table(conn, create_table_sql):
   try:
      c = conn.cursor()
      c.execute(create_table_sql)
      print("Table created")
   except Error as e:
        print(e)

def insert_data(conn, data):
   # sql_insert_data = 
   try:
      c = conn.cursor()
      name = data['fname'] +' '+ data['lname'] if data['fname'] != None and data['lname'] != None else None
      c.execute(
         """insert into patients(name,gender,age,medications,notes,photo,vaccinationCertificate) values(?,?,?,?,?,?,?)""",(name, data['gender'], data['age'], data['medication'],data['notes'], data['photo'], data['cert'])
      )
      c.execute('commit')
   except Error as e:
        print(e)

if __name__ == '__main__':
   app.run(debug = True)