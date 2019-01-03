# gas-PageSpeedInsights-V5

Google Apps Script to record the return value of the PageSpeedInsights v5 API in the spreadsheet

-----------------------------------------
## Getting started       

* **Dependency**        
	* Installing Node.js and npm.
	* Installing clasp.     

* **Cloning the repository.**     
```console
git clone https://github.com/kemsakurai/gas-PageSpeedInsights-v5.git <project_name>   
```

* **Go to the cloned directory and run `npm install`**    
```console
cd <project_name>
npm install
```

* **Change the script ID in `.clasp.json`**    
Create a spreadsheet to be recorded and get the script ID of the container bind script.
The procedure for obtaining the script ID is as follows.      

	* Open the script editor from the menu tool of the spreadsheet you created.     
	![Open Script Editor](https://drive.google.com/uc?export=view&id=1nZXERpu3NeAfabBI-J2SVeQqudw_nGFr)

	* The script editor starts. Open the Project Properties on the File menu.     
	![Project Properties](https://drive.google.com/uc?export=view&id=1O1qJ4I95cihc1o6g3yJfXMIQzepf3Vs1)   

	* A window opens. Since the script ID is displayed, copy it.       
	![script ID](https://drive.google.com/uc?export=view&id=15znYKdlaUp2TK6hs9CM2MYO_YR8D5aAq)       

	* Change the script ID of .clasp.json`
	Paste the acquired script ID into the scriptId of `.clasp.json`.     
	```javascript
	{
  		"scriptId": "<your_script_id>",
  		"rootDir": "dist"
	}
	```       

* **Build and deploy**     
	* **Build**     
	Create `bundle.js` and` updateSchedule.html` under the dist directory.     
	```console
	npm run build     
	```     

	* **Deploy**          
	Build and deploy to the script specified in `.clasp.json`.
	```console
	npm run deploy     
	```

* **Settings after deployment**      
Set the following key in the script properties.      
	* **PSI_API_KEY**           
	Set the API key of PageSpeedInsights API v5.
There is a Publish API Key button on [Get Started with the PageSpeed Insights API | PageSpeed Insights | Google Developers] (https://developers.google.com/speed/docs/insights/v5/get-started).      

	* **REFERER**          
	It is optional. When set, it gives a REFERER header at the request, and treats the set value as the referrer value.      


* **Spreadsheet settings**        
When the script is deployed, the following menu will be displayed.
Specify the URL to be recorded, create a sheet for recording, and set schedule execution.    
![menu](https://drive.google.com/uc?export=view&id=1jRDJACy8sZlDJ_Je9QbCSaKlJ3_sttyk)         

	* **1. Create config sheet**               
	Create a config sheet.     
	You can make a sheet with the following layout.     
	In the `Urls`, enter the URL to be recorded, and` SheetName` as the name of the recording sheet.      
	![config](https://drive.google.com/uc?export=view&id=1MJM7-nZOCDaI97QM_mPbqcBmiEoBGrWU)
	Three or four URLs are upper limit within 6 minutes script execution time limit.     

	* **2. Create recording sheet**        
	Based on the contents of the config sheet, create a recording sheet.     
	The recording sheet has the following columns.     
	These are MOBILE and DESKTOP scores, basic speed indicators.     
		* DATE
		* MOBILE.accessibilityScore
		* MOBILE.bestPracticesScore
		* MOBILE.performanceScore
		* MOBILE.pwaScore
		* MOBILE.seoScore
		* MOBILE.firstContentfulPaint
		* MOBILE.speedIndex
		* MOBILE.interactive
		* MOBILE.firstMeaningfulPaint
		* MOBILE.firstCpuIdle
		* MOBILE.estimatedInputLatency
		* DESKTOP.accessibilityScore
		* DESKTOP.bestPracticesScore
		* DESKTOP.performanceScore
		* DESKTOP.pwaScore
		* DESKTOP.seoScore
		* DESKTOP.firstContentfulPaint
		* DESKTOP.speedIndex
		* DESKTOP.interactive
		* DESKTOP.firstMeaningfulPaint
		* DESKTOP.firstCpuIdle
		* DESKTOP.estimatedInputLatency     

	* **3. Run Test**       
	After "Test Sheet Creation" "Create Recording Sheet", you can execute "Test Execution".        
	Depending on the contents of the `config` sheet, the results of the API are recorded on the recording sheet.     

	* **4. Shchedule**    
	Recording on recording sheet can be schedule execution registration.      
	You can do exactly the same as doing a time-based trigger of a script trigger.     

------------------------------------------------------
## Points to note when drawing graphs      
Spreadsheet or DataPortal graph drawing can be done, but one point to note below.     

* **The unit of estimatedInputLatency is milliseconds**           
Other speed indicators are seconds, but the estimatedInputLatency returns in milliseconds.
Unit adjustment is necessary when drawing with the same graph as same as other speed indicators.       


