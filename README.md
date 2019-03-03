# Banner Process

Includes:

* The Lucky Spritesheet PSD plugin
* The Banner QA Chrome plugin (beta)
* Starter files for a 300x250 Standard
* Starter files for a 300x250 DCS
* Starter files for a 300x250 Sizmek

## Installing & Using the Lucky Sprite Photoshop Plugin

### How to install 

* Download the plugin from the repo.
* Unzip and place luckysprite.zip into /{{yourUserAccount}}/Library/Application\Support/Adobe/CEP/Extensions
* In your terminal, if your Photoshop is 2017:

```
defaults write com.adobe.CSXS.7 PlayerDebugMode 1
```

if your Photoshop is 2018:

```
defaults write com.adobe.CSXS.8.plist PlayerDebugMode 1
```

if your Photoshop is 2019:

```
defaults write com.adobe.CSXS.9.plist PlayerDebugMode 1
```

- In photoshop, go to window > extensions > Lucky Sprite Panel. Note: If the plugin continues to gives you an error or simply doesn't show, restart your computer. 

### How to use

* Make sure your units in photoshop are set to pixels. 
* Divide the elements of your PSD file into layer comps. Anything which animates separately, be sure to divide into individual layer comps. 
* Press 'Sprite me' and watch the magic happen.

Tips:
* Naming a layer comp 'bg' (case specific) will place the layer comp at the bottom of the rendered spritesheet with a space between the second last frame and the last frame.
* Note the plugin does not input spacing between layer comps on the spritesheet.
* Make sure there are no locked layers, as a trim prompt will interupt the creation of the spritesheet and result in unaccurate calculations.


## Using the Sprite Builder Web App

Go to the [web app](http://sprbr.mhweb.ca/)

* Select or drag & drop your spritesheet into the application. Note: The spritesheet needs to contain the file size as the last part of the file name. Ex.'banner_spritesheet-300x250'. This is how the app knows what size to make the container.
* Naturually when your file is uploaded, the app will detect each layer comp and give it a class of frame[i].
* An ID is given to each item detected. The detection offset dictates how many pixels away individual items can be before getting grouped together.
* Click and drag to select elements. You can then merge (cmd + g) elements which will then be contained by a div in the HTML. 
* Once selected, you may alter the ID, Class and zIndex of the rendered element.
* Click 'PREVIEW' to view the rendered HTML/CSS.

## Reducing filesize with tinypng
Go to the tinypng [web app](https://tinypng.com/) or use the [CLI](https://www.npmjs.com/package/tinypng-cli)

To install the CLI, you must get an API Key from their [website](https://tinypng.com/developers). Once obtained, make a '.tinypng' file on your home directory and copy & paste your API key into the file. With this developer licence, you will be able to compress 500 images a month for free. You are able to track the amount of images you have compressed via their [dashboard](https://tinypng.com/dashboard/api).

You will then need to install the CLI through your commandline. Open up terminal and type the following sequential lines:
```
npm install -g tinypng-cli
```

Once installed, you will be able to run a variety of commands from your banner project directory. More commands can be found on the [documentation page](https://www.npmjs.com/package/tinypng-cli), but I have listed some common commands below.

To shrink all PNG images within the current directory, you may run one of the following commands—both do exactly the same.
```
tinypng
tinypng .
```

To shrink all PNG images within the current directory and subdirectoies, use the -r flag.
```
tinypng -r
```

## Standard Banner Quality Assurance

Reference [iab standards](https://www.iab.com/wp-content/uploads/2017/08/IABNewAdPortfolio_FINAL_2017.pdf)

## Chrome Plugins

Simply go [chrome extensions](chrome://extensions/), make sure 'developer mode' is on and then click 'Load Unpacked'. Select the root folder of each plugin and enjoy! 


### Staging QA

* Metatag & ad spec matches.
* Banner has a contrasting 1px border.
* Replay button activates replay and animates on hover.
* Click tag works and opens in another tab.
* Banner & animation matches the creative & animation notes.
* Animation does not exceed 15s long (total time including repeats) -- Unless otherwise stated by the media plan.
* Audio is muted with an optional user initiated button to unmute.
* Audio mutes on clickthrough.
* The creative does not blink, flashe, or strobe more than 4 times in one animation loop.

### Packaging QA

* CPU usage does not exceed 30% of load max.
* Maximum number of host-initiated files requests does not exceed 10 ( Number of files being requested by the ad -- this includes images, fonts, css/js files etc.).
* Under client specific file size.
* Backup image under 40kb, matches the size of creative & includes border -- included in the 150kb max filesize unless otherwise stated by the media plan.

## Packaging Structure

#### Zipping the Creative
Upon final delivery, each banner will be required to be zipped into a 150kb zipped file (unless otherwise stated by the publisher), accompanied by a backup image with a size of 40kb or less. This backup image will **not** be placed inside the zip folder, instead will be given the same name as the zipped file and placed in the same delivery folder beisde the zip file. 

#### Naming Convention
Your zipped delivery folder should be named as follows: projectNumber_client_projectName_language.zip
Ex. TW000100_DAZN_soccerBanners_EN.zip

#### Folder Structure
Your packaged creative can be placed in the 'DELIVERY' folder located in the root of each project. Inside this 'DELIVERY' folder, you will make a folder with today's date in the format (MM-DD-YYYY), which will include the zipped delivery folder.
DELIVERY -> 09-12-2018 -> project_folder_name -> project_1.zip, project_1.jpg, project_2.zip, project_2.jpg 



















