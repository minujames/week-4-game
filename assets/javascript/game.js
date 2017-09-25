$(document).ready(function(){

  function Player (name, healthPoints, attackPower, counterAttackPower) {
      this.name = name;
      this.healthPoints = healthPoints;
      this.attackPower = attackPower;
      this.counterAttackPower = counterAttackPower;
      this.earnedAttackPower = attackPower;
      // this.image = image; 
  }
   
  $.extend(Player.prototype, {
    getInfo: function() {
        return this.name + ' ' + this.healthPoints + ' ' + this.attackPower +
          ' ' + this.counterAttackPower + ' ' + this.earnedAttackPower;
    },

    attack: function(defender) {
      // add hasOwnProperty
      defender.healthPoints = defender.healthPoints - this.earnedAttackPower;
      this.healthPoints = this.healthPoints - defender.counterAttackPower;
      this.earnedAttackPower = this.earnedAttackPower + this.attackPower;
    }
  });

  var game = {
    players : {},
    hero: '',
    defender: '',
    enemies: '',

    initialize: function(){
      this.reset();
      displayPlayers();
    },

    reset: function(){
      var player1 = new Player("P1 Minu", 100, 6, 10);
      var player2 = new Player("P2 Jayesh", 150, 10, 20);
      var player3 = new Player("P3 Nidhi", 180, 15, 25);
      var player4 = new Player("P4 Anoop", 120, 8, 15);

      this.players[player1.name] = player1;
      this.players[player2.name] = player2;
      this.players[player3.name] = player3;
      this.players[player4.name] = player4;
      // console.log(this.players);
    }
  };

  game.initialize();

  function displayPlayers()
  {

    for (var playerName in game.players) {     
      var playerObj = game.players[playerName];
      // console.log(playerName, playerObj);

      var player = $("<div>");
      player.attr("player-name", playerName);
      player.append("<section id='name'>" + playerName + "</section>");
      player.addClass("character");
      player.addClass("player");

      var playerImg = $("<img>");
      playerImg.attr("src", "assets/images/luke.jpg");
      playerImg.addClass("player-image");
      player.append(playerImg);
      
      player.append("<section id='hp'>" + playerObj.healthPoints + "</section>");
      $("#your-character").append(player);
    }

  }

  // Registering event on static parent
  $("#your-character").on("click", ".player", function(){
    console.log("hero: " + this);

    if(game.hero !== '')
    {
      console.log("You have already selected a hero!")
      console.log(this);
    }
    else
    {
      var hero = $(this).attr("player-name");
      game.hero = game.players[hero];
      console.log(hero);

      // immediate child selector
      $("#your-character > div").each(function () {
        var playerName = $(this).attr("player-name");
        console.log("div: " + playerName);
        $(this).removeClass("player");

        if(playerName === hero){
          $(this).addClass("hero");
        }
        else{
          $(this).addClass("enemy");
          $("#enemies").append(this);
        }
      });
    }
  });

  $("#enemies").on("click", ".enemy", function(){
    if(game.defender !== ''){
      console.log("You have already selected a defender");
    }
    else{
      var defender = $(this).attr("player-name");
      game.defender = game.players[defender];
      console.log(defender);
      $(this).addClass("defender");
      $(this).removeClass("enemy");
      $("#defender").append(this);
    }
  });

  $("#button-attack").on("click", function(){
      console.log("hero HP :" + game.hero.healthPoints);
      game.hero.attack(game.defender);

      console.log("hero HP :" + game.hero.healthPoints);


  });


  // Player.prototype = {
  // }

});