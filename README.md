# fuzzy-car

## [EN]
This is a JavaScript project that simulates a self-driving car using fuzzy logic to avoid obstacles.

## [PL]
To jest projekt w JavaScript, który symuluje samochód autonomiczny wykorzystujący logikę rozmytą do unikania przeszkód.

## App prezentation
![Image: Self driving car app view](https://github.com/user-attachments/assets/95b8c95d-83d8-486b-9078-8264818a528d)  
*Image: Self driving car app view.*. 

The application simulates road traffic. The red block represents an autonomous vehicle equipped with three sensors. The central sensor is responsible for transmitting input data to the fuzzy logic rule set, while the other two sensors determine whether a turn is possible and in which direction. The fuzzy logic rules govern the vehicle's turning angle and speed. The vehicle's task is to avoid obstacles, such as other vehicles on the road (represented by blue blocks) and roadside barriers. In some cases, collisions occur, at which point the application is halted. To prevent such situations, the vehicle would need to be equipped with additional sensors that could account for a larger area around the vehicle, including objects located alongside or behind it.
