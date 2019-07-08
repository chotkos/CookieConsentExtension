import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';

import styles from './CookieConsent.module.scss'

 
const LOG_SOURCE: string = 'CookieConsentApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICookieConsentApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class CookieConsentApplicationCustomizer
  extends BaseApplicationCustomizer<ICookieConsentApplicationCustomizerProperties> {

    
    // These have been added
  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    
    return Promise.resolve();
  }

  _onDispose(){
    //Disposal of component?
  }

  private _renderPlaceHolders():void {
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      if(!this.getCookie('spfxCookieConsent')){

        if (this._topPlaceholder.domElement) {
          this._topPlaceholder.domElement.innerHTML = `
          <div id="spfxCookieConsent" class=${styles.app}>
            <p class=${styles.text}>This site uses cookies to improve your browsing experience.  
              <a href="www.somepolicyforcookies.com"> Read more about our cookies policy.<a>            
            </p> 
            <button class=${styles.btn} type="button" onClick="setCookieSpfx()">I accept cookies</button>
          </div>`;
        
          document['setCookieSpfx'] = function(e){ 
            document.cookie = "spfxCookieConsent=true;"+ document.cookie;
            document.getElementById('spfxCookieConsent').style.display = "none";
          }
        
        }
      }
      
    }
  }

  private getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }

}
