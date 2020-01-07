package com.example.smartparking

import android.content.Intent
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.StrictMode
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Spinner
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_report.*
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.HashMap

class ReportActivity : AppCompatActivity() {
    private val prefsname = "com.example.smartparking.prefs"
    private var prefs: SharedPreferences? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_report)

        prefs = this.getSharedPreferences(prefsname, 0)

        report_button.setOnClickListener {
            val policy =
                StrictMode.ThreadPolicy.Builder().permitAll().build()
            StrictMode.setThreadPolicy(policy)
            report_button.setOnClickListener {
                val params: HashMap<String, String> =
                    object : HashMap<String, String>() {
                        init {
                            put("subject", subjecttext.text.toString())
                            put("text", reportText.text.toString())
                        }
                    }
                if (subjecttext == null || reportText == null) {
                    Toast.makeText(
                        this,
                        "Non sono stati compilati tutti i campi",
                        Toast.LENGTH_LONG
                    )
                        .show()
                } else {
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
                        val url = getString(R.string.connection) + "report"
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
                            }
                        } else {
                            Toast.makeText(
                                this,
                                "Invio della richiesta fallito.",
                                Toast.LENGTH_LONG
                            )
                                .show()
                        }
                    } catch (e: IOException) {
                        e.printStackTrace()
                    }


                }
            }

        }
    }
}
