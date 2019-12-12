package com.example.smartparking

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_parking.*

class ParkingActivity : AppCompatActivity() {
    //iiiiii
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_parking)
        fab.setImageResource(R.drawable.ic_action_add)
        fab.setOnClickListener {
            val addpark = Intent(this, AddParkingActivity::class.java)
            startActivity(addpark)
        }
    }

}
