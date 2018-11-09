/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
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

import React from 'react'
import { expect, find, mount, spy, stub, within } from '@instructure/ui-test-utils'

import View from '@instructure/ui-layout/lib/components/View'

import Tag from '../index'

describe('<Tag />', async () => {
  it('should display text', async () => {
    await mount(<Tag text="Summer" />)
    expect(await find({ contains: 'Summer' })).to.exist()
  })

  it('should render as a button and respond to onClick event', async () => {
    const onClick = stub()
    await mount(<Tag text="Summer" onClick={onClick} />)
    const button = await find({ tag: 'button' })
    await button.click()
    expect(onClick).to.have.been.called()
  })

  it('should render a close icon when it is dismissible and clickable', async () => {
    const onClick = stub()
    await mount(<Tag text="Summer" onClick={onClick} dismissible={true} />)
    expect(await find({ tag: 'svg', name: 'IconX' })).to.exist()
  })

  it('should meet a11y standards', async () => {
    const subject = await mount(<Tag text="Summer" />)
    const tag = within(subject.getDOMNode())
    expect(await tag.accessible()).to.be.true()
  })

  describe('when passing down props to View', async () => {
    const allowedProps = {
      margin: 'small',
      elementRef: () => {}
    }

    Object.keys(View.propTypes)
      .filter(prop => prop !== 'theme' && prop !== 'children')
      .forEach((prop) => {
        const warning = `Warning: ${View.disallowedPropWarning(prop, Tag)}`

        if (Object.keys(allowedProps).indexOf(prop) < 0) {
          it(`should NOT allow the '${prop}' prop`, async () => {
            const props = {
              [prop]: 'foo'
            }
            const consoleWarn = spy(console, 'warn')
            await mount(<Tag text="Summer" {...props} />)

            expect(consoleWarn).to.have.been.calledWith(warning)
          })
        } else {
          it(`should allow the '${prop}' prop`, async () => {
            const props = { [prop]: allowedProps[prop] }
            const consoleWarn = spy(console, 'warn')
            await mount(<Tag text="Summer" {...props} />)
            expect(consoleWarn).to.not.have.been.calledWith(warning)
          })
        }
    })
  })
})
