package com.example.smartparking


import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.activity_add_parking.*
import android.widget.TextView



class AddParkingActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_parking)
        add_button.setOnClickListener {
            var position_text = position_textbox.text.toString()
            var municipality_text = municipality_textbox.text.toString()
            var price_text = price_textbox.text.toString()
            val textView = findViewById<TextView>(R.id.text)



            }
         }
    }
