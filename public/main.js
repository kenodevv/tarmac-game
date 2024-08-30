(function ($) {
  // define variables
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var player, score, stop, ticker ;
  var ground = [], enemies = [];
  var hallo;
  // platform variables
  var platformHeight, platformLength, gapLength;
  var platformWidth = 32;
  var platformBase = canvas.height - platformWidth / 2 + 70 ;  // bottom row of the game
  var platformSpacer = 64;

  let lastFrameTime = 0;

  var canUseLocalStorage = 'localStorage' in window && window.localStorage !== null;
  var playSound;

  var requestedHighscore;


  var discountHasFlown = false;  // New variable to track if discount has flown across the screen


  var playSound;


  //SPEEEEEED


  // Speed for 30 fps
  /*var character_speed = 18;
  var player_frame_speed = 1;
  var sky_speed = 11;
  var layer1_speed = 12;
  var layer2_speed = 13;*/


  var character_speed = 10;
  var player_frame_speed = 4;
  var sky_speed = 7;
  var layer1_speed = 8;
  var layer2_speed = 7;

  
  /**document.getElementById("goleaderboard").addEventListener("click", function() {
    document.getElementById("showleaderboard").style.display = "block"
    document.getElementById("game").style.display = "none"
  
  }) */

  if (canUseLocalStorage) {
      playSound = (localStorage.getItem('playSound') === "true")
    
      if (playSound) {
        $('.sound').addClass('sound-on').removeClass('sound-off');
      }
      else {
        $('.sound').addClass('sound-off').removeClass('sound-on');
      }
    }
    

    window.addEventListener('scroll', function() {
      const leaderboardBtn = document.getElementById('leaderboard-btn');
      const menu = document.getElementById('menu');
      
      const btnRect = leaderboardBtn.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
  
      // Überprüfen, ob der Button außerhalb des Menüs ist
      if (btnRect.bottom > menuRect.bottom || btnRect.top < menuRect.top) {
          leaderboardBtn.classList.add('leaderboard-btn-outside');
      } else {
          leaderboardBtn.classList.remove('leaderboard-btn-outside');
      }
    });  

  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    document.getElementsByClassName("wrapper")[0].style.top = "-60px"
    document.getElementById("game-over").style.top = "-60px"
    document.body.style.zoom = "55%"
  
  } 


  /**
   * Get a random number between range
   * @param {integer}
   * @param {integer}
   */
  function rand(low, high) {
    return Math.floor( Math.random() * (high - low + 1) + low );
  }
  
  /**
   * Bound a number between range
   * @param {integer} num - Number to bound
   * @param {integer}
   * @param {integer}
   */
  function bound(num, low, high) {
    return Math.max( Math.min(num, high), low);
  }
  
  /**
   * Asset pre-loader object. Loads all images
   */
  var assetLoader = (function() {
    // images dictionary
    this.imgs        = {
      'bg'           : 'imgs/bg.png',
      'bglayer1'      : 'imgs/layer1.png',
      'discount'      : 'imgs/lolol.png',
      'username'         : 'imgs/Enter-Username.png',
      'game2over'         : 'imgs/Gameover.png',
      'pressstart'         : 'imgs/Press-Start.png',
      'tarmacstartlogo'         : 'imgs/Tarmac-Start-Logo.png',
      'leaderboardtarmac'         : 'imgs/Tarmac-Leaderboard.png',
      'grass'         : 'imgs/grass.png',
      'avatar_normal' : 'imgs/walkanim.png',
      'barrier-monkey' : 'imgs/barrier-monkey.png',
      'barrier-schere' : 'imgs/barrier-schere.png',
      'barrier-spike'  : 'imgs/barrier-spike.png'
    };

    this.sounds      = {
      'gamemusik'      : 'imgs/musik.mp3'
    };
  
  
    var assetsLoaded = 0;                                // how many assets have been loaded
    var numImgs      = Object.keys(this.imgs).length;
    var numSounds    = Object.keys(this.sounds).length; 
    this.totalAssest = numImgs + numSounds;              

    this.totalAssest = numImgs;                          // total number of assets
  
    /**
     * Ensure all assets are loaded before using them
     * @param {number} dic  - Dictionary name ('imgs', 'sounds', 'fonts')
     * @param {number} name - Asset name in the dictionary
     */
    function assetLoaded(dic, name) {
      // don't count assets that have already loaded
      if (this[dic][name].status !== 'loading') {
        return;
      }
  
      this[dic][name].status = 'loaded';
      assetsLoaded++;
  
      // progress callback
      if (typeof this.progress === 'function') {
        this.progress(assetsLoaded, this.totalAssest);
      }
  
      // finished callback
      if (assetsLoaded === this.totalAssest && typeof this.finished === 'function') {
        this.finished();
      }
    }
  
      /**
   * Check the ready state of an Audio file.
   * @param {object} sound - Name of the audio asset that was loaded.
   */
    function _checkAudioState(sound) {
    if (this.sounds[sound].status === 'loading' && this.sounds[sound].readyState === 4) {
      assetLoaded.call(this, 'sounds', sound);
    }
  }

  
    /**
     * Create assets, set callback for asset loading, set asset source
     */
    this.downloadAll = function() {
      var _this = this;
      var src;
  
      // load images
      for (var img in this.imgs) {
        if (this.imgs.hasOwnProperty(img)) {
          src = this.imgs[img];
  
          // create a closure for event binding
          (function(_this, img) {
            _this.imgs[img] = new Image();
            _this.imgs[img].status = 'loading';
            _this.imgs[img].name = img;
            _this.imgs[img].onload = function() { assetLoaded.call(_this, 'imgs', img) };
            _this.imgs[img].src = src;
          })(_this, img);
        }
      }

      for (var sound in this.sounds) {
        if (this.sounds.hasOwnProperty(sound)) {
          src = this.sounds[sound];
  
          // create a closure for event binding
          (function(_this, sound) {
            _this.sounds[sound] = new Audio();
            _this.sounds[sound].status = 'loading';
            _this.sounds[sound].name = sound;
            _this.sounds[sound].addEventListener('canplay', function() {
              _checkAudioState.call(_this, sound);
            });
            _this.sounds[sound].src = src;
            _this.sounds[sound].preload = 'auto';
            _this.sounds[sound].load();
            _this.sounds[sound].volume = 0.3;

          })(_this, sound);
        }
      }
  
      
        
    }
  
    return {
      imgs: this.imgs,
      sounds: this.sounds,
      totalAssest: this.totalAssest,
      downloadAll: this.downloadAll
    };
  })();
  
  /**
   * Show asset loading progress
   * @param {integer} progress - Number of assets loaded
   * @param {integer} total - Total number of assets
   */
  assetLoader.progress = function(progress, total) {
    var pBar = document.getElementById('progress-bar');
    pBar.value = progress / total;
    document.getElementById('p').innerHTML = Math.round(pBar.value * 100) + "%";
  }
  
  /**
   * Load the main menu
   */
  assetLoader.finished = function() {
    mainMenu();
  }
  
  /**
   * Creates a Spritesheet
   * @param {string} - Path to the image.
   * @param {number} - Width (in px) of each frame.
   * @param {number} - Height (in px) of each frame.
   */
  function SpriteSheet(path, frameWidth, frameHeight) {
    this.image = new Image();
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
  
    // calculate the number of frames in a row after the image loads
    var self = this;
    this.image.onload = function() {
      self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
    };
  
    this.image.src = path;
  }
  
  /**
   * Creates an animation from a spritesheet.
   * @param {SpriteSheet} - The spritesheet used to create the animation.
   * @param {number}      - Number of frames to wait for before transitioning the animation.
   * @param {array}       - Range or sequence of frame numbers for the animation.
   * @param {boolean}     - Repeat the animation once completed.
   */
  function Animation(spritesheet, frameSpeed, startFrame, endFrame, loop = true) {
    var animationSequence = [];  // Array holding the order of the animation
    var currentFrame = 0;        // The current frame to draw
    var counter = 0;             // Keep track of frame rate
    var stopped = false;         // Animation stop flag
    // start and end range for frames
    for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
      animationSequence.push(frameNumber);
    
    /**234
     * Update the animation
     */
    this.update = function() {
      if (stopped) return; // Stop updating if the animation is stopped
      
      // Update to the next frame if it is time
      if (counter == (frameSpeed - 1)) {
        if (currentFrame < animationSequence.length - 1) {
          currentFrame++;
        } else if (loop) {
          currentFrame = 0; // Loop animation
        } else {
          stopped = true;  // Stop the animation if it's not looping
        }
      }
  
      // Update the counter
      counter = (counter + 1) % frameSpeed;
    };
  
    /**
     * Draw the current frame
     * @param {integer} x - X position to draw
     * @param {integer} y - Y position to draw
     */
    this.draw = function(x, y) {
      var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
      var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);
  
      ctx.drawImage(
        spritesheet.image,
        col * spritesheet.frameWidth, row * spritesheet.frameHeight,
        spritesheet.frameWidth, spritesheet.frameHeight,
        x, y+ 12 ,
        spritesheet.frameWidth, spritesheet.frameHeight
      );
    };
  
    /**
     * Reset the animation to its initial state
     */
    this.reset = function() {
      currentFrame = 0;
      counter = 0;
      stopped = false;
    };
  }
  
  /**
   * Create a parallax background
   */
  var background = (function() {
    var sky   = {};
    var bglayer1 = {};
    var bglayer2 = {}
    var discount = {}

  
  
    /**
     * Draw the backgrounds to the screen at different speeds
     */
    this.draw = function() {

      // Pan background
      sky.x -= sky.speed;
      bglayer1.x -= bglayer1.speed;
      bglayer2.x -= bglayer2.speed;

      ctx.drawImage(assetLoader.imgs.bg, 0, 0);

      ctx.drawImage(assetLoader.imgs.bglayer1, bglayer1.x, bglayer1.y);
      ctx.drawImage(assetLoader.imgs.bglayer1, bglayer1.x + canvas.width, bglayer1.y);

      // Move and draw the discount image if score is 100 and it hasn't flown yet
      if (score >= 5000 && !discountHasFlown) {
        discount.x -= discount.speed;
        ctx.drawImage(assetLoader.imgs.discount, discount.x, discount.y);

        // Check if the discount image has completely left the screen
        if (discount.x + assetLoader.imgs.discount.width < 0) {
          discountHasFlown = true; // Set to true once it has flown off the screen
        }
      }

      // If the image scrolled off the screen, reset
      if (bglayer1.x + assetLoader.imgs.bglayer1.width <= 0)
        bglayer1.x = 0;
    };

    /**
     * Reset background to zero
     */
    this.reset = function()  {
      bglayer1.x = 0;
      bglayer1.y = 0;
      bglayer1.speed = layer1_speed;

      bglayer2.x = 0;
      bglayer2.y = 0;
      bglayer2.speed = layer2_speed;

      discount.x = canvas.width;  // Start off-screen to the right
      discount.y = 0;
      discount.speed = layer2_speed;
      discountHasFlown = false;  // Reset for the next game
    };

    return {
      draw: this.draw,
      reset: this.reset
    };
  })();
  
  /**
   * A vector for 2d space.
   * @param {integer} x - Center x coordinate.
   * @param {integer} y - Center y coordinate.
   * @param {integer} dx - Change in x.
   * @param {integer} dy - Change in y.
   */
  function Vector(x, y, dx, dy) {
    // position
    this.x = x || 0;
    this.y = y || 0;
    // direction
    this.dx = dx || 0;
    this.dy = dy || 0;
  }
  
  /**
   * Advance the vectors position by dx,dy
   */
  Vector.prototype.advance = function(deltaTime) {
    this.x += this.dx;
    this.y += this.dy;
  };
  
  /**
   * Get the minimum distance between two vectors
   * @param {Vector}
   * @return minDist
   */
  Vector.prototype.minDist = function(vec) {
    var minDist = Infinity;
    var max     = Math.max( Math.abs(this.dx), Math.abs(this.dy),
                            Math.abs(vec.dx ), Math.abs(vec.dy ) );
    var slice   = 1 / max;
  
    var x, y, distSquared;
  
    // get the middle of each vector
    var vec1 = {}, vec2 = {};
    vec1.x = this.x + this.width/2;
    vec1.y = this.y + this.height/2;
    vec2.x = vec.x + vec.width/2;
    vec2.y = vec.y + vec.height/2;
    for (var percent = 0; percent < 1; percent += slice) {
      x = (vec1.x + this.dx * percent) - (vec2.x + vec.dx * percent);
      y = (vec1.y + this.dy * percent) - (vec2.y + vec.dy * percent);
      distSquared = x * x + y * y;
  
      minDist = Math.min(minDist, distSquared);
    }
  
    return Math.sqrt(minDist);
  };
  
  /**
   * The player object
   */
  var player = (function(player) {
    player.width = 200;
    player.height = 200;
    player.speed = character_speed;

    // Springen
    player.gravity = 1.3;
    player.dy = 0;
    player.jumpDy = -15;
    player.isFalling = false;
    player.isJumping = false;

    // Spritesheets
    player.sheet = new SpriteSheet('imgs/walkanim.png', player.width, player.height);
    player.walkAnim = new Animation(player.sheet, player_frame_speed, 0, 14, true); // Laufanimation mit Loop
    player.jumpAnim = new Animation(player.sheet, 4, 15, 24, false); // Sprunganimation ohne Loop
    player.fallAnim = new Animation(player.sheet, 8, 20, 24, false); // Fallanimation mit Loop
    player.anim = player.walkAnim;
    
    Vector.call(player, 0, 0, 0, player.dy);

    /**
     * Update the player's position and animation
     */
    player.update = function(deltaTime) {
      // Start the jump if space is pressed and the player is on the ground
      if (KEY_STATUS.space && player.dy === 0 && !player.isJumping) {
        player.dy = player.jumpDy;
        player.anim = player.jumpAnim;
        player.anim.reset();  // Reset the animation so it starts from the first frame

        player.isJumping = true;
      }
  
      this.advance(deltaTime);
  
      // Apply gravity
      if (player.isFalling || player.isJumping) {
          player.dy += player.gravity;
      }
  
      // If the player is falling
      if (player.dy > 0 && player.isJumping) {
          player.isFalling = true;
          player.isJumping = false;
      }
  
      // Check if player is on the ground
      if (player.dy === 0) {
          player.isFalling = false;
  
          // Switch back to walking animation when the player is on the ground
          if (player.anim !== player.walkAnim) {
              player.anim = player.walkAnim;
          }
      }
  
      player.anim.update();
  };
  

    /**
     * Draw the player at its current position
     */
    player.draw = function() {
      player.anim.draw(player.x, player.y);
    };

    /**
     * Reset the player's position
     */
    player.reset = function() {
      player.x = 64;
      player.y = 150;
      player.isJumping = false; // Ensure jumping state is reset
    };

    return player;
})(Object.create(Vector.prototype));

  
  /**
   * Sprites are anything drawn to the screen (ground, enemies, etc.)
   * @param {integer} x - Starting x position of the player
   * @param {integer} y - Starting y position of the player
   * @param {string} type - Type of sprite
   */
  function Sprite(x, y, type) {
    if(type == "barrier-schere"){
      y = y
      x = x+75
    }

    this.x      = x;
    this.y      = y;
    this.width  = platformWidth;
    this.height = platformWidth;
    this.type   = type;
    Vector.call(this, x, y, 0, 0);
  
    /**
     * Update the Sprite's position by the player's speed
     */
    this.update = function() {
      this.dx = -player.speed;
      this.advance();
    };
  
    /**
     * Draw the sprite at it's current position
     */
    this.draw = function() {
      ctx.save();
      ctx.translate(0.5,0.5);
      ctx.drawImage(assetLoader.imgs[this.type], this.x, this.y);
      ctx.restore();
    };
  }
  Sprite.prototype = Object.create(Vector.prototype);
  
  /**
   * Get the type of a platform based on platform height
   * @return Type of platform
   */


  
  /**
   * Update all ground position and draw. Also check for collision against the player.
   */
  function updateGround() {
    // animate ground
    player.isFalling = true;
    for (var i = 0; i < ground.length; i++) {
      ground[i].update();
      ground[i].draw();
  
      // stop the player from falling when landing on a platform
      var angle;
      if (player.minDist(ground[i]) <= player.height/2 + platformWidth/2 &&
          (angle = Math.atan2(player.y - ground[i].y, player.x - ground[i].x) * 180/Math.PI) > -130 &&
          angle < -50) {
        player.isJumping = false;
        player.isFalling = false;
        player.y = ground[i].y - player.height + 5;
        player.dy = 0;
      }
    }
  
    // remove ground that have gone off screen
    if (ground[0] && ground[0].x < -platformWidth) {
      ground.splice(0, 1);
    }
  }
  
  function updateEnemies(deltaTime) {
    // animate enemies
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].update(deltaTime);
      enemies[i].draw();
  
      if (player.minDist(enemies[i]) <= (player.width - 100) - 20) {  // Passen Sie die Werte nach Bedarf an
        gameOver();
      }
      
      }
    // remove enemies that have gone off screen
    if (enemies[0] && enemies[0].x < -platformWidth) {
      enemies.splice(0, 1);
    }
  } 
  
    
  /**
   * Update the players position and draw
   */
function updatePlayer(deltaTime) {
  player.update(deltaTime);
  player.draw();

  // game over
  if (player.y + player.height >= canvas.height) {
    gameOver();
  }
}
  
function need(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
  /**
   * Spawn new sprites off screen
   */
  hilfsvariable = 50;
  kenodev_was_here = 'trmc_'
  function spawnSprites() {
    // Erhöhung des Scores
    score++;
    scoreTEST = score + 25;
    
    // Kodierung des Scores
    const randomFactor = Math.floor(Math.random() * 10); // Zufallszahl zwischen 0 und 9
    const encodedScore = scoreTEST * 44.5 + randomFactor;
    
    // Kodierung des Benutzernamens in Base64
    const encodedUsername = btoa(localStorage.getItem('username')); // btoa() codiert eine Zeichenfolge in Base64
    
    // Erstellen des Tokens
    kenodev_was_here = `trmc_${encodedScore}_${randomFactor}_${encodedUsername}`;

    // Erzeugen Sie eine lange Plattform ohne Lücken
    if (platformLength > 0) {
        var type = "grass";
        ground.push(new Sprite(
            canvas.width + platformWidth % player.speed,
            platformBase - platformHeight * platformSpacer,
            type
        ));
        platformLength--;
    }
    spawnEnemySprites();
    // Stellen Sie sicher, dass die Plattformlänge niemals null wird
    if (platformLength <= 0) {
        platformLength = 99999;  // Setzen Sie eine sehr große Zahl, um eine durchgehende Plattform zu gewährleisten
    }
}
  
  /**
   * Spawn new environment sprites off screen
   */

  
  function spawnEnemySprites() {
    if (Math.random() > 0.30 && enemies.length < 1 && platformLength > 8 &&
        (enemies.length ? canvas.width - enemies[enemies.length-1].x >= platformWidth * 3 ||
         canvas.width - enemies[enemies.length-1].x < platformWidth : true)) {

        // Zufälliger Gegner mit unterschiedlichen Wahrscheinlichkeiten
        let enemyType;
        let randomNum = Math.random();
        
        if (randomNum < 0.1) {  // 10% Chance für Affen
            enemyType = "barrier-monkey";
        } else if (randomNum < 0.55) {  // 45% Chance für Schere
            enemyType = "barrier-schere";
        } else {  // 45% Chance für Spike
            enemyType = "barrier-spike";
        }

        enemies.push(new Sprite(
            canvas.width + platformWidth % player.speed,
            platformBase - platformHeight * platformSpacer - platformWidth - 35,  // Affe nach oben verschieben
            enemyType
        ));
    }
}
  


  previousValue = 50;

  /**
   * Game loop
   */
  function animate(time) {
    if (!stop) {
        setTimeout(function() {
            requestAnimFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Delta-Time berechnen
            const deltaTime = clamp(time - lastFrameTime, 0, 1/60)
            lastFrameTime = time;

            background.draw(deltaTime);

            // Zeichne und aktualisiere das Gras zuerst
            updateGround(deltaTime);

            // Zeichne und aktualisiere die Gegner danach
            updateEnemies(deltaTime);

            // Zeichne und aktualisiere den Spieler zuletzt, damit er oben angezeigt wird
            updatePlayer(deltaTime);

            // Zeichne den Score
            if (requestedHighscore !== undefined) {
                ctx.fillText('Highscore: ' + requestedHighscore, canvas.width - 150, 30);
            }
            ctx.fillText('Score: ' + score, 30, 30);

            // Neue Sprite spawnen
            if (ticker % Math.floor(platformWidth / player.speed) === 0) {
                spawnSprites();
            }

            // Erhöhe die Spieler-Geschwindigkeit nur beim Springen
            if (ticker > (Math.floor(platformWidth / player.speed) * player.speed * 20) && player.dy !== 0) {
                player.speed = bound(player.speed + 2, 0, 30);
                player.walkAnim.frameSpeed = Math.floor(platformWidth / player.speed) - 1;

                // Reset ticker
                ticker = 0;

                // Spawne eine Plattform, um die durch die Erhöhung der Geschwindigkeit entstandene Lücke zu füllen
                if (gapLength === 0) {
                    var type = "grass";
                    ground.push(new Sprite(
                        canvas.width + platformWidth % player.speed,
                        platformBase - platformHeight * platformSpacer,
                        type
                    ));
                    platformLength--;
                }
            }

            ticker++;
        }, 1000 / 45);
    }
}
  
  /**
   * Keep track of the spacebar events
   */
  var KEY_CODES = {
    32: 'space'
  };
  var KEY_STATUS = {};
  for (var code in KEY_CODES) {
    if (KEY_CODES.hasOwnProperty(code)) {
       KEY_STATUS[KEY_CODES[code]] = false;
    }
  }
  document.onkeydown = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
      e.preventDefault();
      KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
  };
  document.onkeyup = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
      e.preventDefault();
      KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
  };
 
  document.getElementById("mobileclick").addEventListener('touchstart', function() {
    KEY_STATUS[KEY_CODES[32]] = true;   
  })
  
  document.getElementById("mobileclick").addEventListener('touchend', function() {
    KEY_STATUS[KEY_CODES[32]] = false;   
  })

  
  /**
   * Request Animation Polyfill
   */
  var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback, element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();
  
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Show the main menu after loading all assets
   */
  function mainMenu() {

    assetLoader.sounds.gamemusik.loop = true;

    if(localStorage.getItem('username') != null){
      fetch(`/playerStats/${localStorage.getItem('username')}`, {
        method: 'GET',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
        },

      })
      .then(async function(response) {
        const body2 = await response.json();
        if(body2.player.score != undefined){
          requestedHighscore = body2.player.score
        }

      }).catch(function(error) {
          console.error('Error:', error);
      });
    }


    for (var sound in assetLoader.sounds) {
      if (assetLoader.sounds.hasOwnProperty(sound)) {
        assetLoader.sounds[sound].muted = !playSound;
      }
    }
      

    $('#progress').hide();
    $('#main').show();
    $('#menu').addClass('main');
    $('.sound').show();
  }
  
  /**
   * Start the game - reset all variables and entities, spawn ground and water.
   */
  function startGame() { 
    $('#canvas').show()


    ground = [];
    enemies = [];
    player.reset();
    ticker = 0;
    stop = false;
    score = 0;
    platformHeight = 2;
    platformLength = 15;
    player.speed = character_speed;
    gapLength = 0;

    ctx.font = '16px arial, sans-serif';
  
    for (var i = 0; i < 30; i++) {
      ground.push(new Sprite(i * (platformWidth-3), platformBase - platformHeight * platformSpacer, 'grass'));
    }
  

  
    background.reset();
    

    animate(performance.now());

    assetLoader.sounds.gamemusik.currentTime = 0;
    assetLoader.sounds.gamemusik.play();

  
  }
  
  /**
   * End the game and restart
   */
  function gameOver() {
    
    fetch(`/playerUpdate/${localStorage.getItem('username')}/${score}/${kenodev_was_here}`, {
      method: 'POST',
      mode: "cors",
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async function(response) {
        const body2 = await response.json();
        requestedHighscore = body2.score;
        ctx.fillText('Highscore: ' + requestedHighscore, canvas.width - 150, 30);

        //document.getElementById("subtitle").innerText = `You ran ${score} meters.\nYour highscore is ${body2.oldscore} meters.`;

    }).catch(function(error) {
        console.error('Error:', error);
    });

    stop = true;

    $('#score').html(score);

    $('#menu').hide();
    $('#canvas').hide()
    $('#game-over').show();
}

  
  /**
   * Click handlers for the different menu screens
   */

function addAtSymbol(name) {
    // Überprüfen, ob der Name bereits mit '@' beginnt
    if (name.startsWith('@')) {
        // Wenn ja, gib den Namen unverändert zurück
        return name;
    } else {
        // Wenn nicht, füge '@' am Anfang hinzu und gib den modifizierten Namen zurück
        return '@' + name;
    }
}


  $('.startButton').click(function() {
    if(localStorage.getItem("username")){
      $('#menu').hide();
      startGame();
    }else{
      document.getElementById('menu').style.filter = "blur(5px)"
      document.getElementById('username').style.display = 'block';
      document.getElementsByClassName('startButton')[0].disabled = true;
      document.getElementById('leaderboard-btn').disabled = true;
      document.getElementById('username-submit').addEventListener("click", function(){
        if(document.getElementById('username-input').value == ''){
          document.getElementById('username-input').style.border = "2px solid red"
        }else{
          
          localStorage.setItem('username', addAtSymbol(document.getElementById('username-input').value))
          document.getElementById('menu').style.filter = ""
          $('#menu').hide();
          document.getElementById('username').style.display = 'none';
          document.getElementsByClassName('startButton')[0].disabled = false;
          document.getElementById('leaderboard-btn').disabled = false;

          startGame();
        }
        
        document.getElementById('username-input').addEventListener("focus", function(){
          document.getElementById('username-input').style.border = ""
        })
      })
    }
  });


  $('.sound').click(function() {
    var $this = $(this);
    // sound off
    if ($this.hasClass('sound-on')) {
      $this.removeClass('sound-on').addClass('sound-off');
      playSound = false;
    }
    // sound on
    else {
      $this.removeClass('sound-off').addClass('sound-on');
      playSound = true;
    }
  
    if (canUseLocalStorage) {
      localStorage.setItem('playSound', playSound);
    }
  
    // mute or unmute all sounds
    for (var sound in assetLoader.sounds) {
      if (assetLoader.sounds.hasOwnProperty(sound)) {
        assetLoader.sounds[sound].muted = !playSound;
      }
    }
  });

  $('#leaderboard-btn').click(function(){
    $('#menu').hide();
    $('#canvas').hide()
    $('#leaderboard').show();
  })

  $('#leaderboard-back').click(function() {
    $('#leaderboard').hide();
    $('#canvas').show()

    $('#menu').show();
  });

  var gameON = false
  $('#jump').click(function() {
    if(gameON == false){
      $('#menu').hide();
      startGame();
      gameON = true
    }
  });

  $('.restart').click(function() {
    $('#game-over').hide();
    $('#canvas').show()


    startGame();
  });

  $('.home').click(function() {
    $('#game-over').hide();
    $('#menu').show();
  });
  
  assetLoader.downloadAll();
  })(jQuery);
