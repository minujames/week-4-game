$(document).ready(function(){

  // Player constructor function to create player objects
  function Player (name, healthPoints, attackPower, counterAttackPower, image) {
      this.name = name;
      this.healthPoints = healthPoints;
      this.attackPower = attackPower;
      this.counterAttackPower = counterAttackPower;
      this.earnedAttackPower = attackPower;
      this.image = image;
  }
   
  // Adding methods to Player class 
  $.extend(Player.prototype, {

    attack: function(defender) {
      defender.healthPoints = defender.healthPoints - this.earnedAttackPower;
      this.healthPoints = this.healthPoints - defender.counterAttackPower;
    },

    earnAttackPower: function(){
      this.earnedAttackPower += this.attackPower;
    }
  });

  // Game object which contains all the game logic and DOM manipulation
  var game = {
    // For easy look up players are kept in a dictionary, instead of array.
    // Player name is the key, which is considered as the unique key.
    players : {},
    hero: null,
    defender: null,
    enemies: null,

    initialize: function(){
      this.reset();
    },

    reset: function(){
      this.hero = null;
      this.enemies = null;
      this.defender = null;
      
      var player1 = new Player("Luke Skywalker", 100, 6, 10, "luke.jpg");
      var player2 = new Player("Darth Maul", 120, 8, 15, "darth-maul.jpg");
      var player3 = new Player("Darth Vader", 150, 10, 20, "darth-vader.jpg");
      var player4 = new Player("Yoda", 180, 15, 25, "yoda.jpg");
      
      this.players[player1.name] = player1;
      this.players[player2.name] = player2;
      this.players[player3.name] = player3;
      this.players[player4.name] = player4;

      this.enemies = this.players;

      this.displayPlayers();
      this.toggleRestartButton();
      this.displayMessage("");
      this.disableAttackButton(true);
    },

    displayPlayers: function(){
      for (var playerName in this.players) {     
        var playerObj = this.players[playerName];

        var player = $("<div>");
        player.attr("player-name", playerName);
        player.append("<section id='name'>" + playerName + "</section>");
        player.addClass("character");
        player.addClass("player");

        var playerImg = $("<img>");
        playerImg.attr("src", "assets/images/" + playerObj.image);
        playerImg.addClass("player-image");
        player.append(playerImg);
        
        player.append("<section id='hp'>" + playerObj.healthPoints + "</section>");
        $("#your-character").append(player);
      }
    },

    setHeroAndEnemies: function(player){
      if(this.hero !== null){
        this.displayMessage("You have already selected your character!");
      }
      else{
        var heroName = $(player).attr("player-name");
        this.hero = this.players[heroName];
        console.log("Your character: " + this.hero.name);
        delete this.enemies[heroName];


        // Iterating through each player and giving them class enemy if that player is not hero.
        // Setting the class hero for the selected player.
        $("#your-character > div").each(function () {
          var playerName = $(this).attr("player-name");
          $(this).removeClass("player");

          if(playerName === heroName){
            $(this).addClass("hero");
          }
          else{
            $(this).addClass("enemy");
            $("#enemies").append(this);
          }
        });
      }
    },

    setDefender: function(player){
      if(this.defender !== null){
        this.displayMessage("You have already selected a defender");
      }
      else{
        this.disableAttackButton(false);
        // Removing the existing defender and assigning the new defender.
        $(".defender").remove();
        var defender = $(player).attr("player-name");
        this.defender = this.players[defender];
        delete this.enemies[defender];
        console.log("Defender: " + this.defender.name);
        console.log("enemies list: " + this.enemies)

        $(player).addClass("defender");
        $(player).removeClass("enemy");
        $("#defender").append(player);
        this.displayMessage("Start fight by pressing Attack");
      }
    },

    attack: function(){
      var message = "";

      this.hero.attack(this.defender);
      this.updateHealthPoints();
      
      if(this.hero.healthPoints <= 0 || this.defender.healthPoints <= 0)
      {
        var isHeroWinner = this.hero.healthPoints > this.defender.healthPoints ? true : false;
        if(isHeroWinner){
          if(Object.keys(this.enemies).length === 0){
            message = "You Won! Press Restart to play again";
            this.toggleRestartButton();
          }
          else{
            message = "You have defeated " + this.defender.name + ", you can choose to fight another enemy."
            this.defender = null;
          }
        }
        else{
          message = "You been defeated... GAME OVER! Press Restart to play again!"
          this.toggleRestartButton();
        }
        this.disableAttackButton(true);
      }
      else{ 
        message = "You attacked " + this.defender.name + " for " + this.hero.earnedAttackPower 
        + " damage." + this.defender.name + " attacked you back for " + this.defender.counterAttackPower 
        + " damage.";
      }

      this.hero.earnAttackPower();
      this.displayMessage(message);
    },

    clearCharacters: function(){
      $( ".character" ).remove();
    },

    toggleRestartButton: function(){
      $("#button-restart").toggle();
    },

    updateHealthPoints: function(){
      $(".hero").children("#hp").text(this.hero.healthPoints);
      $(".defender").children("#hp").text(this.defender.healthPoints);
    },

    displayMessage: function(message){
      $(".message").text(message);
    },

    disableAttackButton: function(status){
      $("#button-attack").attr("disabled", status);
    }

  };

  game.initialize();

  // Registering event on static parent
  $("#your-character").on("click", ".player", function(){
    game.setHeroAndEnemies(this);
  });

  $("#enemies").on("click", ".enemy", function(){
    game.setDefender(this);
  });

  $("#button-attack").on("click", function(){
    game.attack();
  });

  $("#button-restart").on("click", function(){
    game.clearCharacters();
    game.reset();
  });

});