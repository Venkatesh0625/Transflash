SELECT car_model, 
Count(*) AS count,
url
FROM   cars, 
(SELECT vehicle_id, 
        car_id, 
        number_plate 
 FROM   vehicles 
 WHERE  ( avail = "1" 
          AND station_id = '${startLocation}' ) 
         OR vehicle_id IN (SELECT vehicle_id 
                           FROM   (SELECT *, 
                                          Row_number() 
                                            OVER ( 
                                              partition BY vehicle_id 
                                              ORDER BY end_time DESC) 
                                          row_num 
                                   FROM   booking 
                                   WHERE  end_time < '${startDate}' 
                                          AND vehicle_id NOT IN (SELECT 
                                              vehicle_id 
                                                                 FROM 
                                              booking 
                                                                 WHERE 
                                              ( start_time <= 
                                                '${endDate}' 
                                                AND 
                                                end_time >= '${endDate}' 
                                              ) 
                                                         OR ( 
                                                start_time <= 
                                                '${startDate}' 
                                                AND end_time >= 
                                                    '${startDate}' ))) 
                                  AS tablet 
                           WHERE  row_num = 1 
                                  AND to_station = '${startLocation}' 
                                  AND ( vehicle_id IN 
                                        (SELECT vehicle_id 
                                         FROM 
                                        (SELECT 
                                        *, 
                                        Row_number() 
                                          OVER ( 
                                            partition BY 
                                          vehicle_id 
                                            ORDER BY 
                                          start_time)row_num 
                                                 FROM   booking 
                                                 WHERE 
                                        start_time > '${endDate}') 
                                        AS 
                                        freq 
                                                       WHERE  row_num = 1 
                                                              AND 
                                        from_station = 
                                        '${endLocation}' 
                                        ) 
                                         OR vehicle_id IN 
                                            (SELECT table1.vehicle_id 
                                             FROM   (SELECT 
                                            vehicle_id, 
                                            Count(*) AS count 
                                                     FROM   booking 
                                                     GROUP  BY vehicle_id 
                                                    ) 
                                                    AS 
                                                    table1, 
                                                    (SELECT 
                                            vehicle_id, 
                                            Count(*) AS count 
                                                     FROM   booking 
                                                     WHERE 
                                            end_time < '${startDate}' 
                                            AND vehicle_id NOT IN (SELECT 
                                                vehicle_id 
                                                                   FROM 
                                                booking 
                                                                   WHERE 
                                                ( start_time <= 
                                                  '${endDate}' 
                                                  AND 
                                                  end_time >= 
                                                  '${endDate}' 
                                                ) 
                                                           OR ( 
                                                  start_time <= 
                                                  '${startDate}' 
                                                  AND end_time >= 
                                                      '${startDate}' )) 
                                                     GROUP  BY vehicle_id 
                                                    ) 
                                                    AS 
                                                    table2 
                                             WHERE 
                                            table1.vehicle_id = 
                                            table2.vehicle_id 
                                            AND table1.count = 
                                                table2.count) ))) 
AS table4 
WHERE  cars.car_id = table4.car_id 
GROUP  BY table4.car_id 