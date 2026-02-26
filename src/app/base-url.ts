import {Injectable, InjectionToken} from "@angular/core";
import * as https from "node:https";


export const BASE_URL = new InjectionToken('base url', {factory: () => 'https://demo.angulararchitects.io/api/flight'})
