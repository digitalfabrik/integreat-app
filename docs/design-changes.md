# Design Changes

###### Design Change: Release of the react-native app
The design of the react-native app will differ in a few points.
* "Extras" will be changed to "Angebote"
* The Tabs will get removed on Android and iOS
* A Dashboard/Startpage is added
 ![](figures/preview.jpg)
 Note: The event preview is planned for a future design change.
 Note: The header should contain the Integreat logo xor the back button on iOS and Android.
  
* If the user wants to change from a Page to an Event he has to navigate back to the Dashboard
* A new Set of Icons will be defined and will replace all icons
* name_without_prefix in Header und prefix in klammern dahinter
* 'name_without_prefix' should be displayed in Header. The 'prefix' should be added in brackets. Like: Augsburg (Landkreis)
* There will be no language selection screen after selecting a city
* The new intro slides will be displayed after selecting a city
![](figures/intro-slides.png)
Therefore they can be i18n-ized



Nice to have:
* If possible try to add the name of the current city to multiple routes
