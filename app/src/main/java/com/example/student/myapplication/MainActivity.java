package com.example.student.myapplication;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    TextView txt;
    Button btn;
    TextView txt1;
    Button btn1;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        txt=(TextView) findViewById(R.id.mytext);
        btn=(Button) findViewById(R.id.mybutton);
        txt1=(TextView) findViewById(R.id.myt);
        btn1=(Button) findViewById(R.id.myb);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                txt.setText("Xin chào:Cao Quốc Đông");
            }
        });

        btn1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                txt1.setText("Tạm biệt:Cao Quốc Đông");
            }
        });
    }
}
