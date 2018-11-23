LISA-TOOLS
----------


FOLDERS LIST
------------
# constructs 
	@ constructs.component.html - This page displays the default images in the template section.  

	@ constructs.component.ts -  “ngOnInit” - Initialize the directive/component after Angular first displays the data-bound properties and sets the directive/component's input properties,

# search-home
	@ search-home.component.html - Once the user types the keyword and press enter we have make an API call, On success response we have displayed the results in the slides, 

	@ search-home.component.ts - The keyword search and result slide is displayed here, The total count is displayed from the response,

# icons
	@ icons.component.ts - “ngOnInit” - Initialize the directive/component after Angular first displays called once, the ngOnInit function called the function getIcons which retrieve the response from mocks-icons.ts,

# icons-home

# services
	@ construct.service.ts - Loads the pre-declared files from mock-constructs.ts
	@ icon.service.ts - Loads the pre-declared files from mock-icons.ts
	@ search.service.ts - The API call is taken place in the search.service.ts file, which displays the result in the search-home.component.html,
	
 

