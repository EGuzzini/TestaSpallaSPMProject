package com.example.smartparking

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_parking.*

class ParkingActivity : AppCompatActivity() {
    var prefs : SharedPreferences? = null
    val PREFS_FILENAME = "com.example.smartparking.prefs"
    override fun onCreate(savedInstanceState: Bundle?) {
        prefs = this.getSharedPreferences(PREFS_FILENAME, 0)
        var tokenget=""
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_parking)
        fab.setImageResource(R.drawable.ic_action_add)
        Log.d("porcoddio",prefs!!.getString("token",tokenget))
        fab.setOnClickListener {
            val addpark = Intent(this, AddParkingActivity::class.java)
            startActivity(addpark)

        }
    }

}
