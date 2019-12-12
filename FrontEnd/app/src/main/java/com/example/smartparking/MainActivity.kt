package com.example.smartparking

import android.content.Intent
import android.os.Bundle
import android.os.StrictMode
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val policy =
            StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)
        val url = getString(R.string.connection)
        val urlObj = URL(url)

        val conn = urlObj.openConnection() as HttpURLConnection
        Log.d("HTTP-GET", "conn ${conn.responseCode}")
        try {
            val br =
                BufferedReader(InputStreamReader(conn.inputStream))
            val line = br.readLine()
            Log.d("HTTP-GET", "conn $line")
        } catch (e: IOException) {
            e.printStackTrace()
        } finally {
            conn.disconnect()
        }

        if (conn.responseCode == 200) {
            val mySuperIntent = Intent(this@MainActivity, LoginActivity::class.java)
            startActivity(mySuperIntent)
            finish()
        } else {
            Toast.makeText(this, "Connessione al server fallita.", Toast.LENGTH_SHORT).show()
        }
    }
}
