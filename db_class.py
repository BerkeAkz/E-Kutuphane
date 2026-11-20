import mysql.connector

class MySqlVeriTabani:
    def __init__(self,database):
        self.__host="localhost"
        self.__user="root"
        self.__password=""
        self.__database=database
        self.__connection=None
        self.__curser=None


    def vt_baglantisi_acma(self):
        try:
            self.__connection=mysql.connector.connect(
                 host=self.__host,
                 user=self.__user,
                 password=self.__password,
                database=self.__database
            )

            if (self.__connection.is_connected()):
                 self.__cursor = self.__connection.cursor(dictionary=True) #burayı çözümle
                 print("Veri Tabanı Bağlantısı Kuruldu")
        except mysql.connector.Error as hata: 
                 print("Veri Tabanı Bağlantısı Kurulamadı")
                 
    def vt_baglantisi_kapama(self):
         if self.__curser:
              self.__curser.close()
              self.__cursor = None
         if self.__connection and self.__connection.is_connected():
               self.__connection.close()
               self.__connection = None



if __name__ == "__main__":
    db = MySqlVeriTabani("ekutuphane")
    db.vt_baglantisi_acma()
    db.vt_baglantisi_kapama()