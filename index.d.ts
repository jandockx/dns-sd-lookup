/*
 * MIT License
 *
 * Copyright (c) 2018 - 2018 Jan Dockx
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Type definitions for @toryt/dns-sd-lookup
// Project: @toryt/dns-sd-lookup
// Definitions by: Jan Dockx

import * as ServiceInstance from './lib/ServiceInstance'
import * as validate from './lib/validate'
import * as extract from './lib/extract'
import * as lookupInstance from './lib/lookupInstance'
import * as discover from './lib/discover'
import * as selectInstance from './lib/selectInstance'

export { ServiceInstance }
export { validate }
export { isSubtypeOrInstanceName } from './lib/validate'
export { isBaseServiceType } from './lib/validate'
export { isServiceType } from './lib/validate'
export { isServiceInstance } from './lib/validate'
export { extract }
export * from './lib/extendWithTxtStr'
export { lookupInstance }
export { discover }
export { selectInstance }
