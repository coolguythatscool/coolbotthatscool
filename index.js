const Discord = require("discord.js");
const superagent = require("superagent");
const Cleverbot = require("cleverbot-node");
const anti_spam = require("discord-anti-spam");
const clbot = new Cleverbot;
const bot = new Discord.Client();

const CL = process.env.cltoken;
const P = process.env.prefix;
const O = process.env.ownerid;
const T = process.env.token;
const I = process.env.invite;

clbot.configure({botapi: CL});

var fortunes = [
    "Yes",
    "No",
    "My butthole isn't bleached enough for me to answer this",
    "Maybe"
];

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

bot.on("ready", ready => {
    console.log('Ready to rumble!')
})

bot.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    bot.user.setGame(`on ${bot.guilds.size} servers`);
  });
  
bot.on("guildDelete", guild => {
   // this event triggers when the bot is removed from a guild.
   console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
   bot.user.setGame(`on ${bot.guilds.size} servers`);
 });

const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }


//anti_spam(bot, {
//    warnBuffer: 3, //Maximum amount of messages allowed to send in the interval time before getting warned.
//    maxBuffer: 5, // Maximum amount of messages allowed to send in the interval time before getting banned.
//    interval: 1000, // Amount of time in ms users can send a maximum of the maxBuffer variable before getting banned.
//    warningMessage: "stop spamming or I'll whack your head off.", // Warning message send to the user indicating they are going to fast.
//    banMessage: "has been banned for spamming, anyone else?", // Ban message, always tags the banned user in front of it.
//    //maxDuplicateWarning = 7,// Maximum amount of duplicate messages a user can send in a timespan before getting warned
//    //maxDuplicateBan = 10 // Maximum amount of duplicate messages a user can send in a timespan before getting banned
//  });


bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find("name", "hangout");
    if (!channel) return;
    channel.send(`Welcome ${member} to ${member.guild.name}. Do \`${P}serverinfo\` for more information.`);
  });


bot.on("message", async function(message){
    console.log(`${message.author.username} (${message.guild.name}): ${message.content}`);
       
    if (message.author.equals(bot.user)) return;


    let member = message.guild.member(message.author);
    let roles = member.roles.array();

    function findFreshman(rolename) {
        return rolename.name === 'Freshman';
    }
    
    if(message.member.roles.has("name", "Freshman")) {
        const linkCheck = (/([-a-zA-Z0-9^\p{L}\p{C}\u00a1-\uffff@:%_\+.~#?&//=]{2,256}){1}(\.[a-z]{2,4}){1}(\:[0-9]*)?(\/[-a-zA-Z0-9\u00a1-\uffff\(\)@:%,_\+.~#?&//=]*)?([-a-zA-Z0-9\(\)@:%,_\+.~#?&//=]*)?/i)

        if (!message.content === linkCheck) console.log("No rule breaking today!");
        
        if (message.content === linkCheck) {
            message.delete()
                .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
            message.reply("You must be at least level 5 and have freshman role to post links. Check <#369606424558567434> as to why this is.")
        }};


    if (message.content == "you there?") {
        message.react('\u{1F44D}')
        console.log("You know it ;)")};


    if(message.content.startsWith('prefix')) {
        message.channel.send(`The current prefix is \`${P}\``)
    }

    if (message.content == "nigger")
        message.channel.send("Dont' say that, nigger");


    if (message.content == "social bot")
        message.channel.send("Present! :raised_hand:");


    if (message.content == "Social Bot")
        message.channel.send("Present! :raised_hand:");

    if (message.content == "copycat") {
        var embedcopycat = new Discord.RichEmbed()
                  .setImage("https://media.indiatimes.in/media/content/itimes/blog/2015/Jul/24/1437724864-10-bollywood-movie-posters-that-were-copied-from-hollywood.gif")
                  .setColor(0x0AA99C)
        message.channel.send(embedcopycat)};


    if (!message.content.startsWith(P)) return;
    
    var args = message.content.substring(P.length).split(" ");

    switch (args[0].toLowerCase()) {

        case "8ball":
            if (args[1]) message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
                else message.channel.send("Type something, how am I supposed to answer if you dont tell me what you want to be answered? :thinking:");
                break;


        case "avatar":
            let user;            
            if (args.length === 1){
                user = message.guild.member(message.author);
            } else{
                user = args[1].replace(/[<@!>]/g, "");
                user = message.guild.member(user);
            }           
            if (!user){
                return message.reply("Please specify an actual user. Not your imaginary friend.");
            }
            var embedavatar = new Discord.RichEmbed()
                .setTitle(user.user.username)
                .setImage(user.user.avatarURL)
                .setColor(0x1ABC9C)
            return message.channel.send(embedavatar);
            break;


        case "commands":
            var embed = new Discord.RichEmbed()
                .setTitle("__Commands__")
                .addField("**Fun**", "8ball - decides your fate\nflip - flips a coin\ncat - random cat picture :3\ndog - random dog picture OwO\npic - random picture (could be anything)")
                .addField("**Other**", "If you DM the bot, it will reply as cleverbot")
                .addField("**Utilities**", "info - more info about the server\navatar - shows your own avatar, or the avatar of a mentioned user\ncommands - displays this menu\nping - shows the amount of time it takes to connect to the discord server\ninvites - shows how many people the user has invites to the guild")
                .addField("**Moderation**", "leaveserver - gives information on how to make the bot leaver the server\nkick - kicks the mentioned user `-kick [user] [reason]'\nban - bans the mentioned user '-ban [user] [reason]'\npurge - deletes [x] messages")
                .addField("**Stupid**", "type - makes the bot keep showing '[Social Bot] is typing'\nstoptype - stops the effects of the previously mentioned command")
                .setFooter(`Every command uses the prefix ${P}`)
                .setColor(0x00FFFF)

            if (message.author.id == (O)) {
                message.reply("I doubt you need to see your own bot's help command but I'll send them anyway.")
            };
            
            message.author.sendEmbed(embed); 
            
            message.channel.send(":incoming_envelope: Check your DMs :envelope:")
            break;


        case "help":
            var embed = new Discord.RichEmbed()
                .setTitle("__Commands__")
                .addField("**Fun**", "8ball - decides your fate\nflip - flips a coin\ncat - random cat picture :3\ndog - random dog picture OwO\npic - random picture (could be anything)")
                .addField("**Other**", "If you DM the bot, it will reply as cleverbot")
                .addField("**Utilities**", "info - more info about the server\navatar - shows your own avatar, or the avatar of a mentioned user\ncommands - displays this menu\nping - shows the amount of time it takes to connect to the discord server\ninvites - shows how many people the user has invites to the guild")
                .addField("**Moderation**", "leaveserver - gives information on how to make the bot leaver the server\nkick - kicks the mentioned user `-kick [user] [reason]'\nban - bans the mentioned user '-ban [user] [reason]'\npurge - deletes [x] messages")
                .addField("**Stupid**", "type - makes the bot keep showing '[Social Bot] is typing'\nstoptype - stops the effects of the previously mentioned command")
                .setFooter(`Every command uses the prefix ${P}`)
                .setColor(0x00FFFF)

            if (message.author.id == (O)) {
                message.reply("I doubt you need to see your own bot's help command but I'll send them anyway.")
            };
            
            message.author.sendEmbed(embed); 
            
            message.channel.send(":incoming_envelope: Check your DMs :envelope:")
            break;


        case "leaveserver":
            message.channel.send("Just kick me from the server, my creator is too lazy to program that")
            break;


        case "flip":
            var flip = [
                "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", "Heads", 
                "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails", "Tails",
                "You'll never believe this, it landed on its edge"
            ];
            if (args[0]) message.channel.send(flip[Math.floor(Math.random() * flip.length)]);
            break;


        case "ping":
        message.channel.send("Ping?")
        .then(mesg => {mesg.edit(`Pong! Latency is ${mesg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`)});
            break;


        case "kick":
            if(!message.member.roles.some(r=>["Staff", "Spooky", "Bot Developer", "Moderator"].includes(r.name)) )
              return message.reply("Sorry, you don't have permissions to use this!");

            let member = message.mentions.members.first();
            if(!member)
              return message.reply("Please mention a valid member of this server");
            if(!member.kickable) 
              return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

            let reason = args.slice(1).join(' ');
            if(!reason)
            return message.reply("Please indicate a reason for the kick!");
    
            member.kick(reason)
              .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
            message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
            break;


        case "ban":
            
            if(!message.member.roles.some(r=>["Staff", "Spooky", "Bot Developer", "Moderator"].includes(r.name)) )
              return message.reply("Sorry, you don't have permissions to use this!");
    
            if(!member)
              return message.reply("Please mention a valid member of this server");
            if(!member.bannable) 
              return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

            if(!reason)
              return message.reply("Please indicate a reason for the ban!");
            
            await member.ban(reason)
              .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
            message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
            break;


        case "purge":        
            const deleteCount = Number(args[1]);

            if(!message.member.roles.some(r=>["Staff", "Spooky", "Bot Developer", "Moderator", "Bot Creator"].includes(r.name)) )
                return message.reply("Sorry, you don't have permissions to use this!");
            
            if(!deleteCount || deleteCount < 2 || deleteCount > 100) 
              return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
            const fetched = await message.channel.fetchMessages({limit: deleteCount + 1});
            message.channel.bulkDelete(fetched)
              .catch(error => message.reply(`Couldn't delete messages because of: \`${error}\``));
            break;


        case "dog":
            superagent.get("https://random.dog/woof.json")
                .end((err, response) => {
                    if(err) message.channel.send("Can't send photo because" + err)

                    var embeddog = new Discord.RichEmbed()
                        .setTitle("Here's a dog! :dog:")
                        .setImage(JSON.parse(response.text).url)
                        .setColor(0x0AA99C)
                    message.channel.send(embeddog)
                })
            break;


        case "cat":
            superagent.get("https://random.cat/meow")
                .end((err, response) => {
                    if(err) message.channel.send("Can't send photo because" + err)

                    var embedcat = new Discord.RichEmbed()
                        .setTitle("Here's a cat! :cat:")
                        .setImage(JSON.parse(response.text).file)
                        .setColor(0x0AA99C)
                    message.channel.send(embedcat)
                })
            break;

        
        case "pic":
            superagent.get("http://www.splashbase.co/api/v1/images/random")
                .end((err, response) => {
                    if(err) message.channel.send("Can't send photo because" + err)

                    var embedpic = new Discord.RichEmbed()
                        .setTitle("Here's a random picture")
                        .setImage(JSON.parse(response.text).url)
                        .setColor(0x0AA99C)
                    message.channel.send(embedpic)
                })
            break;
            
        
        case "invites":
                var person = message.author
                break;

        
        case "type":
                message.channel.startTyping();
                message.channel.sendMessage("I will forever be typing!")
                break;
        

        case "stoptype":
                message.channel.stopTyping();
                message.channel.sendMessage("Dang, you have defeated me!")
                break;


        case "eval":
                const argse = message.content.split(" ").slice(1);
                
                if(message.author.id !== O) {
                    message.reply("nice try!");
                    return
                };
                try {
                    const code = argse.join(" ");
                    let evaled = eval(code);
              
                    if (typeof evaled !== "string")
                      evaled = require("util").inspect(evaled);
              
                    message.channel.send(clean(evaled), {code:"xl"});
                  } catch (err) {
                    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
                  }
            break;


        case "thonk":
                var embedthonk = new Discord.RichEmbed()
                    .setImage("https://media.discordapp.net/attachments/366590343291863040/373886662809223169/thonk.png")
                    .setColor(0x0AA99C)
                message.channel.send(embedthonk)
                break;

        
        case "thinkplant":
                var embedthinkplant = new Discord.RichEmbed()
                    .setImage("https://i.redd.it/dr2bkuil30vy.png")
                    .setColor(0x0AA99C)
                message.channel.send(embedthinkplant)
                break;

        
        case "3dthink":
                var embed3dthink = new Discord.RichEmbed()
                    .setImage("https://media1.tenor.com/images/f226dcc33fd3e2ea7f0b11e4a88ec8ed/tenor.gif")
                    .setColor(0x0AA99C)
                message.channel.send(embed3dthink)
                break;

        
        case "thinkception":
                var embedthinkception = new Discord.RichEmbed()
                    .setImage("http://i0.kym-cdn.com/photos/images/facebook/001/267/652/284.png")
                    .setColor(0x0AA99C)
                message.channel.send(embedthinkception)
                break;

        case "3dthonk":
                var embed3dthonk = new Discord.RichEmbed()
                    .setImage("http://i0.kym-cdn.com/photos/images/newsfeed/001/292/906/c4a.gif")
                    .setColor(0x0AA99C)
                message.channel.send(embed3dthonk)
                break;

        
        case "copycat":
            var embedcopycat = new Discord.RichEmbed()
                  .setImage("https://media.indiatimes.in/media/content/itimes/blog/2015/Jul/24/1437724864-10-bollywood-movie-posters-that-were-copied-from-hollywood.gif")
                  .setColor(0x0AA99C)
            message.channel.send(embedcopycat)
            break;


        case "wtf":
            var embedwtf = new Discord.RichEmbed()
                  .setImage("http://cdn.barstoolsports.net/wp-content/uploads/2015/10/22/jackie-chan.jpg")
                  .setColor(0x0AA99C)
            message.channel.send(embedwtf)
            break;

        case "say":
            const params = message.content.split(' ').slice(1);
            const sayMessage = params.join(" ");
            message.delete().catch(O_o=>{}); 
            message.channel.send(sayMessage);
            break;


        case "servericon":
            var guildname = message.guild.name
            var embedservericon = new Discord.RichEmbed()
                .setTitle(`${guildname}'s icon`)
                .setImage(message.guild.iconURL)
                .setColor(0x0AA99C)
            message.channel.send(embedservericon)
            break;


        case "serverinfo":
            var embedserverinfo = new Discord.RichEmbed()
                  .setTitle(`${message.guild.name}'s info`)
                  .setThumbnail(message.guild.iconURL)
                  .addField(":person_frowning: **Name**", `${message.guild.name}`, true)
                  .addField(":page_facing_up:  **ID**", `${message.guild.id}`, true)
                  .addField(":couple: **Members**", `${message.guild.memberCount}`, true)
                  .addField(":map: **Region**", `${message.guild.region}`, true)
            message.channel.send(embedserverinfo)
            break;

        
        case "invite":
            var embedinvite = new Discord.RichEmbed()
                  .addFiled('**Invite this bot to your server!**', [link](I))
            
        case "uptime":
            var time = process.uptime();
            var uptime = (time + "").toHHMMSS();
            message.channel.send(`The bot's uptime is: ${uptime}`);
            break;
             

        default:
            message.react('\u{26A0}') // Warning Sign
            message.channel.send(`Do \`${P}commands\` for commands. (or \`${P}help\`)`)}});

bot.login(T);
