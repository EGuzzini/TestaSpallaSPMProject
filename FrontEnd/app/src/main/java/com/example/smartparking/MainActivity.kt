package com.example.smartparking

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.os.StrictMode
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL


class MainActivity : AppCompatActivity() {
    private var prefs: SharedPreferences? = null
    private val prefsname = "com.example.smartparking.prefs"
    override fun onCreate(savedInstanceState: Bundle?) {
        prefs = this.getSharedPreferences(prefsname, 0)
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val policy =
            StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)
        val url = getString(R.string.connection)
        val urlObj = URL(url)

        val conn = urlObj.openConnection() as HttpURLConnection
        val tokenget = prefs!!.getString("token", "defvalue")
        conn.setRequestProperty("Authorization", "Bearer $tokenget")
        conn.connect()
        try {
            BufferedReader(InputStreamReader(conn.inputStream))
        } catch (e: IOException) {
            e.printStackTrace()
        } finally {
            if (conn.responseCode == 200) {
                val mySuperIntent = Intent(this@MainActivity, MapActivity::class.java)
                startActivity(mySuperIntent)
                finish()
            } else {
                val mySuperIntent = Intent(this@MainActivity, LoginActivity::class.java)
                startActivity(mySuperIntent)
                finish()
            }
            conn.disconnect()


        }

    }
}
