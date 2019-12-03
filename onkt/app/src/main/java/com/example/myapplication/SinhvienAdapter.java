package com.example.myapplication;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.List;

public class SinhvienAdapter extends BaseAdapter {
    public MainActivity context;
    public int layout;
    public List<Sinhvien> listsv;

    public SinhvienAdapter(MainActivity context, int layout, List<Sinhvien> listsv) {
        this.context = context;
        this.layout = layout;
        this.listsv = listsv;
    }

    @Override
    public int getCount() {
        return listsv.size();
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }
    public class Viewholder{
        TextView textView;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        Viewholder viewholder;

        if(view==null)
        {
            viewholder=new Viewholder();
            LayoutInflater inflater=(LayoutInflater)context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view=inflater.inflate(layout,null);
            viewholder.textView=(TextView)view.findViewById(R.id.tvten);
            view.setTag(viewholder);
        }
        else
        {
            viewholder=(Viewholder)view.getTag();
        }
        final Sinhvien sinhvien=listsv.get(i);
        viewholder.textView.setText(sinhvien.getTen());

        return view;
    }
}
