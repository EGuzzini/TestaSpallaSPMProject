package com.example.smartparking

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.StrictMode
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_register.*
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.HashMap

class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)
        val policy =
            StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)
        register_button.setOnClickListener {
            if (password_register.text.toString() == repassword_register.text.toString()) {
                val params: HashMap<String, String> =
                    object : HashMap<String, String>() {
                        init {
                            put("email", email_register.text.toString())
                            put("username", username_register.text.toString())
                            put("password", password_register.text.toString())
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
                    val url = getString(R.string.connection) + "register"
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
                        var line: String?
                        while (reader.readLine().also { line = it } != null) {
                            result.append(line)
                        }
                    } catch (e: IOException) {
                        e.printStackTrace()
                    } finally {
                        conn.disconnect()
                    }
                } catch (e: IOException) {
                    e.printStackTrace()
                }
            } else {
                Toast.makeText(this, "Password not matching, please check.", Toast.LENGTH_SHORT)
                    .show()
            }
            Toast.makeText(this, "Account created. Please Log-in.", Toast.LENGTH_SHORT)
                .show()
            val regact = Intent(this, LoginActivity::class.java)
            startActivity(regact)
        }
    }
}
