package com.example.smartparking

import android.R.attr.name
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.os.Handler
import android.os.StrictMode
import android.preference.PreferenceManager
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_login.*
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.*


class LoginActivity : AppCompatActivity() {
    val PREFS_FILENAME = "com.example.smartparking.prefs"
    var prefs :SharedPreferences? = null
    private var doubleBackToExitPressedOnce = false
    override fun onBackPressed() {
        if (doubleBackToExitPressedOnce) {
            moveTaskToBack(true)
            android.os.Process.killProcess(android.os.Process.myPid())
            System.exit(1)
        }
        this.doubleBackToExitPressedOnce = true
        Toast.makeText(this, "Please click BACK again to exit", Toast.LENGTH_SHORT).show()
        Handler().postDelayed(Runnable { doubleBackToExitPressedOnce = false }, 2000)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        var tokenget=""
        prefs = this.getSharedPreferences(PREFS_FILENAME, 0)
    var token=""
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        login_button.setOnClickListener {
            val policy =
                StrictMode.ThreadPolicy.Builder().permitAll().build()
            StrictMode.setThreadPolicy(policy)
            login_button.setOnClickListener {
                var username = username_login.text.toString()
                var password = password_login.text.toString()

                val params: HashMap<String, String> =
                    object : HashMap<String, String>() {
                        init {
                            put("email", "sam")
                            put("username", username)
                            put("password", password)
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
                    val url = getString(R.string.connection) + "login"
                    val urlObj = URL(url)
                    val conn = urlObj.openConnection() as HttpURLConnection
                    conn.doOutput = true
                    conn.requestMethod = "POST"
                    conn.setRequestProperty("Accept-Charset", "UTF-8")
                    conn.readTimeout = 1500
                    conn.connectTimeout = 3000
                    conn.connect()
                    val paramsString: String = sbParams.toString()
                    val wr = DataOutputStream(conn.outputStream)
                    wr.writeBytes(paramsString)
                    wr.flush()
                    wr.close()
                    try {
                        val `in`: InputStream = BufferedInputStream(conn.inputStream)
                        val reader = BufferedReader(InputStreamReader(`in`))
                        val result = StringBuilder()
                        val tokenresult = StringBuilder()
                        var line: String?
                        while (reader.readLine().also { line = it } != null) {
                            result.append(line)

                        }
                        var i =13
                        do{
                           tokenresult.append(result.get(i))
                            i++
                        }while(result.get(i)!='"')
                          token=tokenresult.toString()
                       val editor: SharedPreferences.Editor = prefs!!.edit()
                        editor.putString("token",token)
                        editor.apply()
                       Log.d("test token",prefs!!.getString("token",tokenget))
                        Log.d("test", "result from server: $result")
                    } catch (e: IOException) {
                        e.printStackTrace()
                    } finally {
                        conn.disconnect()
                        val mapact = Intent(this, ParkingActivity::class.java)
                        startActivity(mapact)
                    }
                } catch (e: IOException) {
                    e.printStackTrace()
                }

            }

        }
        RegisterHereText.setOnClickListener {
            val regact = Intent(this, RegisterActivity::class.java)
            startActivity(regact)
        }

    }
}

