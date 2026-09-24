import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe,it,expect,vi} from 'vitest';
import {ThesisChat} from '../checkpoint/ThesisChat';
import App from '../App';
function setup(){const send=vi.fn();render(<ThesisChat messages={[]} onSend={send} busy={false} locked={false}/>);return send}
describe('Thesis composer keyboard',()=>{
 it('Enter sends trimmed input without adding a newline and retains focus',async()=>{const send=setup();const box=screen.getByRole('textbox');await userEvent.type(box,'  Power and cooling  {Enter}');expect(send).toHaveBeenCalledExactlyOnceWith('Power and cooling');expect(box).toHaveValue('');expect(box).toHaveFocus()});
 it('Shift+Enter inserts a newline without sending',async()=>{const send=setup();const box=screen.getByRole('textbox');await userEvent.type(box,'First thought');await userEvent.keyboard('{Shift>}{Enter}{/Shift}Second thought');expect(box).toHaveValue('First thought\nSecond thought');expect(send).not.toHaveBeenCalled()});
 it('empty or whitespace-only Enter does not submit',async()=>{const send=setup();const box=screen.getByRole('textbox');await userEvent.click(box);await userEvent.keyboard('{Enter}   {Enter}');expect(send).not.toHaveBeenCalled();expect(box).toHaveValue('   ')});
 it('IME composition, native composing events and key code 229 cannot submit',()=>{const send=setup();const box=screen.getByRole('textbox');fireEvent.change(box,{target:{value:'変換'}});fireEvent.compositionStart(box);fireEvent.keyDown(box,{key:'Enter'});fireEvent.compositionEnd(box);fireEvent.keyDown(box,{key:'Enter',isComposing:true});fireEvent.keyDown(box,{key:'Enter',keyCode:229});expect(send).not.toHaveBeenCalled();fireEvent.keyDown(box,{key:'Enter'});expect(send).toHaveBeenCalledExactlyOnceWith('変換')});
 it('pointer send remains available',async()=>{const send=setup();await userEvent.type(screen.getByRole('textbox'),'Infrastructure');await userEvent.click(screen.getByRole('button',{name:'Begin thesis conversation'}));expect(send).toHaveBeenCalledExactlyOnceWith('Infrastructure')});
 it('restores focus through asynchronous refinement and places it at the final proposition',async()=>{render(<App/>);for(const message of ['AI infrastructure','not yet visible','two years','orders fail to convert']){const box=screen.getByRole('textbox');await userEvent.type(box,message+'{Enter}');await waitFor(()=>expect(screen.getByText(message,{selector:'.chat-message p',exact:true})).toBeInTheDocument());if(message!=='orders fail to convert')expect(box).toHaveFocus()}expect(screen.getByRole('heading',{level:2})).toHaveFocus()});
});
