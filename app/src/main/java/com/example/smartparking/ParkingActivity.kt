package com.example.smartparking

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

import kotlinx.android.synthetic.main.activity_parking.*

class ParkingActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_parking)
        setSupportActionBar(toolbar)
        fab.setImageResource(R.drawable.ic_action_pass);
        fab.setOnClickListener {
            val x = Intent(this, AddParkingActivity::class.java)
            startActivity(x)
        }
    }

}
