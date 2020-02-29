package com.example.smartparking

import android.content.SharedPreferences
import android.os.Bundle
import android.os.StrictMode
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_add_parking.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.*
import java.net.*
import java.util.*

operator fun JSONArray.iterator(): Iterator<JSONObject> =
    (0 until length()).asSequence().map { get(it) as JSONObject }.iterator()

class AddParkingActivity : AppCompatActivity() {
    private var prefs: SharedPreferences? = null
    private val prefsname = "com.example.smartparking.prefs"
    override fun onCreate(savedInstanceState: Bundle?) {
        prefs = this.getSharedPreferences(prefsname, 0)
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_parking)
        val policy =
            StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)
        add_button.setOnClickListener {
            val params: HashMap<String, String> =
                object : HashMap<String, String>() {
                    init {
                        put("status", "0")
                        put("posx", posx_textbox.text.toString())
                        put("posy", posy_text.text.toString())
                        put("comune", municipality_textbox.text.toString())
                        put("costoorario", price_textbox.text.toString())
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
                val url = getString(R.string.connection) + "parking"
                val urlObj = URL(url)
                val conn = urlObj.openConnection() as HttpURLConnection
                val tokenget = prefs!!.getString("token", "defvalue")
                conn.setRequestProperty("Authorization", "Bearer $tokenget")
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
                        var line: String?
                        while (reader.readLine().also { line = it } != null) {
                            result.append(line)
                        }
                    } catch (e: IOException) {
                        e.printStackTrace()
                    } finally {
                        conn.disconnect()
                    }
                } else {
                    Toast.makeText(this, "Aggiunta del parcheggio fallita", Toast.LENGTH_SHORT)
                        .show()
                }
            } catch (e: IOException) {
                e.printStackTrace()
            }
        }
    }
}
