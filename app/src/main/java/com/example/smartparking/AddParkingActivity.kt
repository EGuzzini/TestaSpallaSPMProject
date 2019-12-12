package com.example.smartparking


import android.os.Bundle
import android.os.StrictMode
import android.util.Log
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_add_parking.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.*

operator fun JSONArray.iterator(): Iterator<JSONObject> =
    (0 until length()).asSequence().map { get(it) as JSONObject }.iterator()

class AddParkingActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_parking)
        val policy =
            StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)
        add_button.setOnClickListener {
            var posxtext = posx_textbox.text.toString()
            var posytext = posy_text.text.toString()
            var municipalitytext = municipality_textbox.text.toString()
            var pricetext = price_textbox.text.toString()
            val textView = findViewById<TextView>(R.id.text)
            val params: HashMap<String, String> =
                object : HashMap<String, String>() {
                    init {
                        put("status", "0")
                        put("posx", posxtext)
                        put("posy", posytext)
                        put("comune", municipalitytext)
                        put("costoorario", pricetext)
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
                    Log.d("test", "result from server: $result")
                } catch (e: IOException) {
                    e.printStackTrace()
                } finally {
                    conn.disconnect()
                }
            } catch (e: IOException) {
                e.printStackTrace()
            }
        }
    }
}
