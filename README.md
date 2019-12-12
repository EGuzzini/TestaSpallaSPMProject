# TestaSpalla-SPM-Project

# Pick-A-Park
## Project Assignment SPM 2019

One of the most complex problem when you go to a city is certainly finding a parking space. Generally the best solution is to avoid the usage of private cars in favour of public transportation. Nonetheless the time spent to find a parking space has also negative effects on the total pollution of the area. A rough esteem can tell us that if you go around looking for a parking space for around 10 minutes at an average of 20Km/h you will drive for around 4km more, and in general with continuous start and stops making the total pollution effect wven wors with respect to a normal drive. 
The objective of the project is to minimize the distance and the time wasted in finding a parking space. For doing this our vision  is that of an intelligent city with a deployed 5G infrastructure that reserves parking space for the minimal time needed in order to give to a driver the possibility to reach the parking space with the car.

In order to make this vision real we imagine that each parking space has sensors that are able to recognize when the space is free or busy. Such information is then made available to a software management system that will be permit the management of such resources. In particular the following non exaustive list of users of the system are imagined:
- **the municipality** that is able to add parking spaces, so to manage their usage, once sensors are installed. Thanks to the installed sensors the muincipality will be able to monitor the status of the parking space, erive analytics onf the usage of parking space and so on.
- **the driver** that accessing to the system will be able to indicate its final destination and then to get a reservation for a parking space. In particular to permit such functionality the driver has to enable the GPS of its device. The management system will be able to track the position of the car, and once it is close enough to the final destination it will select a praking space among those available and will then direct the car toward such destination. Clearly if a parking space is released which is closer to the final destination, and in the current direction of the car, the parking space assigned is changed to the closest one. 
- **municipality police** that will get informed when a car occupy a non authorized parking space so that they can get there to proceed with the removal of the car.
- **Parking company** that mantain the system working and establish the cost per hour of a parking space and so it is interested in the fact that the driver will be charged for using the parking space


For the SPM exam the group has to implement the system described above using at least 4 iterations, in which the needed functionality are described as user stories that are then added to the product backlog and managed in the spring backlog. The management system has to provide a REST API in order to interact with the front end, that could be implemented just as a web application or more naturally using a mobile app to interact with the driver and the municipality police. 
