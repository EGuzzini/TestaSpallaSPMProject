package com.example.smartparking;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.SharedPreferences;
import android.location.Location;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.mapbox.api.directions.v5.models.BannerInstructions;
import com.mapbox.api.directions.v5.models.DirectionsResponse;
import com.mapbox.api.directions.v5.models.DirectionsRoute;
import com.mapbox.geojson.Point;
import com.mapbox.mapboxsdk.Mapbox;
import com.mapbox.services.android.navigation.ui.v5.NavigationView;
import com.mapbox.services.android.navigation.ui.v5.NavigationViewOptions;
import com.mapbox.services.android.navigation.ui.v5.OnNavigationReadyCallback;
import com.mapbox.services.android.navigation.ui.v5.listeners.BannerInstructionsListener;
import com.mapbox.services.android.navigation.ui.v5.listeners.InstructionListListener;
import com.mapbox.services.android.navigation.ui.v5.listeners.NavigationListener;

import com.mapbox.services.android.navigation.v5.navigation.NavigationRoute;
import com.mapbox.services.android.navigation.v5.routeprogress.ProgressChangeListener;
import com.mapbox.services.android.navigation.v5.routeprogress.RouteProgress;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MapActivityTest extends AppCompatActivity implements OnNavigationReadyCallback,
        NavigationListener, ProgressChangeListener, InstructionListListener,
        BannerInstructionsListener {
    private NavigationView navigationView;
    FusedLocationProviderClient mFusedLocationClient;
    private static final String PREF_NAME = "com.example.smartparking.prefs";
    private static Point ORIGIN;
    private double Duration;
    Point DESTINATION;
    Point DESTINATIONE;
    Point ORIGINE;
    int i=0;
    String data=null;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        SharedPreferences POINTS = this.getSharedPreferences(PREF_NAME, 0);
        String DestinationLat = POINTS.getString("DESTINATIONLAT", "defvalue");
        String DestinationLong = POINTS.getString("DESTINATIONLONG", "defvalue");
        Double DestLat = Double.parseDouble(DestinationLat);
        Double DestLong = Double.parseDouble(DestinationLong);
        DESTINATION = Point.fromLngLat(DestLat, DestLong);
        setTheme(R.style.Theme_AppCompat_Light_NoActionBar);
        super.onCreate(savedInstanceState);
        Mapbox.getInstance(this, getString(R.string.mapbox_code));
        setContentView(R.layout.activity_map_test);
        navigationView = findViewById(R.id.navigationView);
        navigationView.onCreate(savedInstanceState);
        navigationView.initialize(this);
        String OriginLat = POINTS.getString("ORIGINLAT", "defvalue");
        String OriginLong = POINTS.getString("ORIGINLONG", "defvalue");
        Double OriLat = Double.parseDouble(OriginLat);
        Double OriLong = Double.parseDouble(OriginLong);
        ORIGIN = Point.fromLngLat(OriLat, OriLong);
    }


    private void startNavigation(DirectionsRoute directionsRoute) {
        NavigationViewOptions.Builder options =
                NavigationViewOptions.builder()
                        .navigationListener(this)
                        .directionsRoute(directionsRoute)
                        .progressChangeListener(this)
                        .shouldSimulateRoute(true)
                        .instructionListListener(this)
                        .bannerInstructionsListener(this);


        navigationView.startNavigation(options.build());

    }
    private void getorigin(){
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        mFusedLocationClient.getLastLocation().addOnCompleteListener(
                new OnCompleteListener<Location>() {
                    @Override
                    public void onComplete(@NonNull Task<Location> task) {
                        Location location = task.getResult();
                        if (location == null) {
                            requestNewLocationData();
                        } else {
                            Double Latitude = location.getLatitude();
                            Double Longitude = location.getLongitude();
                            ORIGINE = Point.fromLngLat(Longitude,Latitude);
                        }

                    }
                }
        );
    }

    private void requestNewLocationData() {

        LocationRequest mLocationRequest = new LocationRequest();
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        mLocationRequest.setInterval(0);
        mLocationRequest.setFastestInterval(0);
        mLocationRequest.setNumUpdates(1);

        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        mFusedLocationClient.requestLocationUpdates(
                mLocationRequest, mLocationCallback,
                Looper.myLooper()
        );

    }
    private LocationCallback mLocationCallback = new LocationCallback() {
        @Override
        public void onLocationResult(LocationResult locationResult) {
            Location mLastLocation = locationResult.getLastLocation();

        }
    };

    private void requestRoute() {

        NavigationRoute.builder(this)
                .accessToken(getString(R.string.mapbox_code))
                .origin(ORIGIN)
                .destination(DESTINATION)
                .alternatives(true)
                .build()
                .getRoute(new Callback<DirectionsResponse>() {
                    @Override
                    public void onResponse(Call<DirectionsResponse> call, Response<DirectionsResponse> response) {
                        DirectionsRoute directionsRoute = response.body().routes().get(0);
                        startNavigation(directionsRoute);
                    }

                    @Override
                    public void onFailure(Call<DirectionsResponse> call, Throwable t) {

                    }
                });
    }

    @Override
    public void onInstructionListVisibilityChanged(boolean shown) {

    }

    @Override
    public BannerInstructions willDisplay(BannerInstructions instructions) {
        return instructions;
    }


    @Override
    public void onNavigationReady(boolean isRunning) {
        requestRoute();
    }

    @Override
    public void onStart() {
        super.onStart();
        navigationView.onStart();
    }

    @Override
    public void onResume() {
        super.onResume();
        navigationView.onResume();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        navigationView.onLowMemory();
    }

    @Override
    public void onBackPressed() {
        if (!navigationView.onBackPressed()) {
            super.onBackPressed();
        }
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        navigationView.onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onRestoreInstanceState(@NonNull Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        navigationView.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    public void onPause() {
        super.onPause();
        navigationView.onPause();
    }

    @Override
    public void onStop() {
        super.onStop();
        navigationView.onStop();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        navigationView.onDestroy();
    }

    @Override
    public void onCancelNavigation() {
        finish();

    }

    @Override
    public void onNavigationFinished() {
    }

    @Override
    public void onNavigationRunning() {

    }
    private void fetchRoute(Point origin, Point destination) {
        NavigationRoute.builder(this)
                .accessToken(Mapbox.getAccessToken())
                .origin(origin)
                .destination(destination)
                .alternatives(true)
                .build()
                .getRoute(new Callback<DirectionsResponse>() {
            @Override
            public void onResponse(Call<DirectionsResponse> call, Response<DirectionsResponse> response) {
                DirectionsRoute directionsRoute = response.body().routes().get(0);
                startNavigation(directionsRoute);
            }

            @Override
            public void onFailure(Call<DirectionsResponse> call, Throwable t) {

            }
        });
    }
    @Override
    public void onProgressChange(Location location, RouteProgress routeProgress) {
        Duration = routeProgress.durationRemaining();
        SharedPreferences POINTS = this.getSharedPreferences(PREF_NAME, 0);
        String DestinationLat = POINTS.getString("DESTINATIONLAT", "defvalue");
        String DestinationLong = POINTS.getString("DESTINATIONLONG", "defvalue");
        String Destinazione= DestinationLat+","+DestinationLong;
        Log.d("durata",Double.toString(Duration));
        if (Duration < 300 && i==0) {
            i=1;
            Log.d("sono","qui");
            HttpURLConnection urlConnection = null;
            URL url = null;
            InputStream inStream = null;
            List<String> desti= null;
            try {

                url = new URL(getString(R.string.connection)+"parkingnearest/"+Destinazione);

                urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.connect();
                inStream = urlConnection.getInputStream();
                BufferedReader bReader = new BufferedReader(new InputStreamReader(inStream));
                String temp;
                while ((temp = bReader.readLine()) != null) {
                    temp=temp.substring(1,temp.length()-1);
                    desti = Arrays.asList(temp.split(","));
                }

                onStop();
                DESTINATIONE = Point.fromLngLat(Double.parseDouble(desti.get(0)),Double.parseDouble(desti.get(1)));
                getorigin();
                fetchRoute(ORIGINE,DESTINATIONE);

            } catch (Exception e) {

            } finally {
                if (inStream != null) {
                    try {
                        inStream.close();
                    } catch (IOException ignored) {
                    }
                }
                if (urlConnection != null) {
                    urlConnection.disconnect();
                }
            }


        }

        }

    }