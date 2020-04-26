var oracledb = require('oracledb');
var config = require('./database_auth');
oracledb.getConnection(config, function(err, connection) {
  var jsThing;
  var plsql;
  if (err) {throw err;}
  jsThing = {
    part1: 'Some kind of thing',
    part2: 100,
    part3: new Date()
  }; 
  plsql = 
   `declare
      l_plsql_thing my_package.thing_t;
    begin
      l_plsql_thing.part_1 := :part_1;
      l_plsql_thing.part_2 := :part_2;
      l_plsql_thing.part_3 := :part_3;
      my_package.my_proc(
        p_the_thing => l_plsql_thing
      );
      
    end;`;
  connection.execute(
    plsql, 
    {
      part_1: jsThing.part1,
      part_2: jsThing.part2,
      part_3: jsThing.part3
    }, 
    function(err, result) {
      if (err) {throw err;}
      console.log('The proc was called successfully!');
      connection.release(function(err) {
        if (err) {throw err;}
        console.log('Connection released.');
      })
  });
});