import sqlite3
from sqlite3 import Error


def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn


def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)


def main():
    database = r"C:\Users\vaibh\Desktop\SJSU\3Sem\280\Assignments\COVID-19-Health-Camp-SPA-Ajax\DB\covid.db"

    sql_create_projects_table = """ CREATE TABLE IF NOT EXISTS patients (
                                        id integer PRIMARY KEY,
                                        name text,
                                        gender text,
                                        age integer,
                                        height integer,
                                        weight integer,
                                        body_temp integer,
                                        pluse_rate integer,
                                        bp integer,
                                        medications text,
                                        notes text,
                                        photo blob
                                    ); """


    # create a database connection
    conn = create_connection(database)

    # create tables
    if conn is not None:
        # create projects table
        create_table(conn, sql_create_projects_table)

    else:
        print("Error! cannot create the database connection.")


if __name__ == '__main__':
    main()