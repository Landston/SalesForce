import { LightningElement, wire} from "lwc";
import desktopTemplate from "./desktop.html";
import mobileTemplate from "./mobile.html";

export default class LwcLocalDevelopmentServerTest extends LightningElement {
  isMobile = false;
  mobileAppName = "IBS Test";

  render() {
    return this.isMobile ? mobileTemplate : desktopTemplate;
  }

  connectedCallback() {
  }

}
