package com.example.myapplication;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.database.Cursor;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {
    EditText edid,edten,edlop;
    Button btnThem,btnXoa,btnSua;
    ListView lvsv;
    ArrayList<Sinhvien> arrayList;
    ArrayAdapter adapter;
    Database database;
    int vitri=-1;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        lvsv=(ListView)findViewById(R.id.listviewsv);
        arrayList=new ArrayList<>();
        edid=(EditText)findViewById(R.id.edID);
        edten=(EditText)findViewById(R.id.edTen);
        edlop=(EditText)findViewById(R.id.edLop) ;
        btnThem=(Button)findViewById(R.id.btnThem);
        btnXoa=(Button)findViewById(R.id.btnXoa);
        btnSua=(Button)findViewById(R.id.btnSua);

        database=new Database(this,"sinhvien.sqlite",null,1);

        database.QueryData("CREATE TABLE IF NOT EXISTS QLSV(Id INTEGER PRIMARY KEY,Tensv VARCHAR(200),Lop VARCHAR(200))");
        /*database.QueryData("INSERT INTO QLSV VALUES(1,'JOHN SMITH','Lop A')");
        database.QueryData("INSERT INTO QLSV VALUES(2,'JOHN CRAIG','Lop A')");*/
        /*database.QueryData("INSERT INTO QLSV VALUES(3,'KANE TOP','Lop A')");*/

        GetData();

        lvsv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                edid.setText(String.valueOf(arrayList.get(i).getId()));
                edten.setText(arrayList.get(i).getTen());
                edlop.setText(arrayList.get(i).getLop());
            }
        });

        btnSua.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AlertDialog.Builder ad= new AlertDialog.Builder(MainActivity.this);
                ad.setMessage("Ban có muốn sửa lại không??").setCancelable(false).setPositiveButton("Có", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        /*int id=Integer.valueOf(edid.getText().toString());*/
                        String ten=edten.getText().toString();
                        String lop=edlop.getText().toString();
                        String id=edid.getText().toString();
                        if(ten.equals("") )
                        {
                            Toast.makeText(MainActivity.this,"Hãy Chọn Tên SV",Toast.LENGTH_LONG).show();

                        } else
                        {
                            database.QueryData("UPDATE QLSV SET Tensv='"+ten+"' WHERE Id='"+Integer.valueOf(id)+"'");
                            Toast.makeText(MainActivity.this,"Đã cập nhật",Toast.LENGTH_SHORT).show();
                            dialogInterface.dismiss();
                            edid.setText("");
                            edlop.setText("");
                            edten.setText("");
                            GetData();

                        }
                    }
                })
                        .setNegativeButton("Không", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                dialogInterface.dismiss();
                            }
                        });
                AlertDialog alertDialog=ad.create();
                alertDialog.setTitle("Thông báo");
                alertDialog.show();
            }
        });
        btnThem.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AlertDialog.Builder ad=new AlertDialog.Builder(MainActivity.this);
                ad.setMessage("Bạn có muốn thêm ko??").setCancelable(false).setPositiveButton("Có", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        String ten=edten.getText().toString();
                        String lop=edlop.getText().toString();
                        String id=edid.getText().toString();
                        if(ten.equals(""))
                        {
                            Toast.makeText(MainActivity.this,"Tên sinh viên trống",Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            database.QueryData("INSERT INTO QLSV VALUES('"+Integer.valueOf(id)+"','"+ten+"','"+lop+"')");
                            Toast.makeText(MainActivity.this,"Đã thêm",Toast.LENGTH_SHORT).show();
                            edten.setText("");
                            edid.setText("");
                            edlop.setText("");
                            dialogInterface.dismiss();
                            GetData();
                        }

                    }
                })
                        .setNegativeButton("Không", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                dialogInterface.dismiss();
                            }
                        });
                AlertDialog alertDialog=ad.create();
                alertDialog.setTitle("Thông báo");
                alertDialog.show();
            }
        });
        btnXoa.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AlertDialog.Builder ad=new AlertDialog.Builder(MainActivity.this);
                ad.setMessage("Bạn có muốn xóa không??").setCancelable(false).setPositiveButton("Có", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        String ten=edten.getText().toString();
                        String lop=edlop.getText().toString();
                        String id=edid.getText().toString();
                        if(ten.equals(""))
                        {
                            Toast.makeText(MainActivity.this,"Tên sinh viên trống",Toast.LENGTH_SHORT).show();
                        }else
                        {
                            database.QueryData("DELETE FROM QLSV WHERE ID='"+Integer.valueOf(id)+"'");
                            Toast.makeText(MainActivity.this,"Đã xóa thành công",Toast.LENGTH_SHORT).show();
                            edten.setText("");
                            edlop.setText("");
                            edid.setText("");
                            dialogInterface.dismiss();
                            GetData();
                        }
                    }
                })
                        .setNegativeButton("Không", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                   dialogInterface.dismiss();
                            }
                        });
                AlertDialog alertDialog=ad.create();
                alertDialog.setTitle("Thông báo");
                alertDialog.show();
            }
        });
    }
    public void GetData(){
        Cursor cs=database.getData("SELECT * FROM QLSV");
        arrayList.clear();
        while (cs.moveToNext()){

            /*Toast.makeText(this,cs.getString(1)+cs.getInt(0)+cs.getString(2),Toast.LENGTH_SHORT).show();*/
            arrayList.add(new Sinhvien(cs.getInt(0),cs.getString(1),cs.getString(2)));
        }
        adapter=new ArrayAdapter(this,android.R.layout.simple_list_item_1,arrayList);
        lvsv.setAdapter(adapter);
        adapter.notifyDataSetChanged();
    }

}
