package com.example.smartparking

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.os.Handler
import android.os.StrictMode
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_login.*
import kotlinx.android.synthetic.main.activity_register.*
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.*
import kotlin.system.*
import android.view.View.OnFocusChangeListener
import androidx.core.app.ComponentActivity.ExtraData
import androidx.core.content.ContextCompat.getSystemService
import android.icu.lang.UCharacter.GraphemeClusterBreak.T
import android.view.View


class LoginActivity : AppCompatActivity() {
    private val prefsname = "com.example.smartparking.prefs"
    private var prefs: SharedPreferences? = null
    private var doubleBackToExitPressedOnce = false
    override fun onBackPressed() {
        if (doubleBackToExitPressedOnce) {
            moveTaskToBack(true)
            android.os.Process.killProcess(android.os.Process.myPid())
            exitProcess(1)
        }
        this.doubleBackToExitPressedOnce = true
        Toast.makeText(this, "Please click BACK again to exit", Toast.LENGTH_SHORT).show()
        Handler().postDelayed({ doubleBackToExitPressedOnce = false }, 2000)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        prefs = this.getSharedPreferences(prefsname, 0)
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
            val policy =
                StrictMode.ThreadPolicy.Builder().permitAll().build()
            StrictMode.setThreadPolicy(policy)
            login_button.setOnClickListener {
                val params: HashMap<String, String> =
                    object : HashMap<String, String>() {
                        init {
                            put("username", username_login.text.toString())
                            put("password", password_login.text.toString())
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
                    if (conn.responseCode == 200) {
                        try {
                            val `in`: InputStream = BufferedInputStream(conn.inputStream)
                            val reader = BufferedReader(InputStreamReader(`in`))
                            val result = StringBuilder()
                            val tokenresult = StringBuilder()
                            var line: String?
                            while (reader.readLine().also { line = it } != null) {
                                result.append(line)
                            }
                            var j = 13
                            do {
                                tokenresult.append(result[j])
                                j++
                            } while (result[j] != '"')
                            val token = tokenresult.toString()
                            val editor: SharedPreferences.Editor = prefs!!.edit()
                            editor.putString("token", token)
                            editor.apply()

                        } catch (e: IOException) {
                            e.printStackTrace()
                        } finally {
                            conn.disconnect()
                            val mapact = Intent(this, MapActivity::class.java)
                            startActivity(mapact)
                            finish()
                        }
                    } else {
                        Toast.makeText(this, "Username o password errati.", Toast.LENGTH_LONG)
                            .show()
                    }
                } catch (e: IOException) {
                    e.printStackTrace()
                }
            }

        RegisterHereText.setOnClickListener {
            val regact = Intent(this, RegisterActivity::class.java)
            startActivity(regact)
        }
        username_login.setOnFocusChangeListener(object : View.OnFocusChangeListener {

           override fun onFocusChange(v: View, hasFocus: Boolean) {
                if (hasFocus)
                    username_login.setHint("")
                else
                    username_login.setHint("Username")
            }
        })
        password_login.setOnFocusChangeListener(object : View.OnFocusChangeListener {

            override fun onFocusChange(v: View, hasFocus: Boolean) {
                if (hasFocus)
                    password_login.setHint("")
                else
                    password_login.setHint("Password")
            }
        })


        recoverypass.setOnClickListener {
            if(username_login.text.toString()!="") {
                     val params: HashMap<String, String> =
                    object : HashMap<String, String>() {
                        init {
                            put("email", username_login.text.toString())
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
                    val url = getString(R.string.connection) + "passwordReset"
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
                    if (conn.responseCode == 200) {
                        try {
                            Toast.makeText(this, "Ti abbiamo inviato una mail con i nuovi dati di accesso", Toast.LENGTH_LONG)
                                .show()
                            val `in`: InputStream = BufferedInputStream(conn.inputStream)
                           var line: String?
                         } catch (e: IOException) {
                            e.printStackTrace()
                        } finally {
                            conn.disconnect()
                        }
                    } else {
                    }
                } catch (e: IOException) {
                    e.printStackTrace()
                }
            }else{
                Log.d("username",username_login.text.toString())
                Toast.makeText(this, "Inserisci username o mail nel campo Username", Toast.LENGTH_LONG)
                    .show()
            }
}

        RegisterHereText.setOnClickListener {
            val regact = Intent(this, RegisterActivity::class.java)
            startActivity(regact)
        }
    }


}

