package com.example.myapplication;

public class Sinhvien {
    public int Id;
    public String ten;
    public String lop;

    public Sinhvien(int id, String ten, String lop) {
        Id = id;
        this.ten = ten;
        this.lop = lop;
    }

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public String getLop() {
        return lop;
    }

    public void setLop(String lop) {
        this.lop = lop;
    }

    @Override
    public String toString() {
        return Id +"  "+ ten ;
    }
}
