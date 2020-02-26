package com.example.smartparking

import android.content.Intent
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.StrictMode
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_account.*
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.HashMap

class AccountActivity : AppCompatActivity() {
    private val prefsname = "com.example.smartparking.prefs"
    private var prefs: SharedPreferences? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        prefs = this.getSharedPreferences(prefsname, 0)
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_account)
        val policy =
            StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)
        change_button.setOnClickListener {
            val params: HashMap<String, String> =
                object : HashMap<String, String>() {
                    init {
                        put("oldpassword", oldpassword.text.toString())
                        put("newpassword", newpassword.text.toString())
                    }
                }
            val sbParams = java.lang.StringBuilder()
            var i = 0
            for (key in params.keys) {
                try {
                    if (i != 0) {
                        sbParams.append("&")
                    }
                    sbParams.append(key).append("=")
                        .append(URLEncoder.encode(params[key], "UTF-8"))
                } catch (e: UnsupportedEncodingException) {
                    e.printStackTrace()
                }
                i++
            }
            try {
                val url =
                    getString(R.string.connection) + "users/changePassword"
                val urlObj = URL(url)
                val conn = urlObj.openConnection() as HttpURLConnection
                conn.doOutput = true
                conn.requestMethod = "POST"
                conn.setRequestProperty("Accept-Charset", "UTF-8")
                conn.readTimeout = 1500
                conn.connectTimeout = 3000
                val tokenget = prefs!!.getString("token", "defvalue")
                conn.setRequestProperty("Authorization", "Bearer $tokenget")
                conn.connect()
                val paramsString: String = sbParams.toString()
                val wr = DataOutputStream(conn.outputStream)
                wr.writeBytes(paramsString)
                wr.flush()
                wr.close()
                if (conn.responseCode == 200) {
                    Toast.makeText(this, "Password modificata con successo.", Toast.LENGTH_LONG)
                        .show()
                    val mapact = Intent(this, LoginActivity::class.java)
                    startActivity(mapact)
                    finish()
                } else {
                    Toast.makeText(this, "Password errata.", Toast.LENGTH_LONG)
                        .show()
                }

                conn.disconnect()


            } catch (e: IOException) {
                e.printStackTrace()
            }
        }
    }
}

