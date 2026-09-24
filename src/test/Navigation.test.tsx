import {render,screen,fireEvent,waitFor,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {it,expect,vi} from 'vitest';
import App from '../App';
it('navigates saved stages without restarting Discovery, preserves exclusions before entering Wash 1',async()=>{
 const fetch=vi.spyOn(globalThis,'fetch');
 const scroll=vi.fn();Element.prototype.scrollIntoView=scroll;
 const media=vi.spyOn(window,'matchMedia').mockReturnValue({matches:true} as MediaQueryList);
 render(<App/>);expect(screen.queryByLabelText('Research navigation')).not.toBeInTheDocument();
 await userEvent.type(screen.getByRole('textbox'),'AI infrastructure{Enter}');
 await waitFor(()=>expect(screen.getByRole('button',{name:'Lock & begin research'})).toBeEnabled());
 fireEvent.click(screen.getByRole('button',{name:'Lock & begin research'}));
 const header=screen.getByLabelText('Research navigation');expect(header).toHaveClass('compact');
 const nav=within(header).getByRole('navigation');expect(within(nav).getAllByRole('button')).toHaveLength(7);
 for(const name of ['Wash 1','Wash 2','Wash 3','Expression','Result'])expect(within(nav).getByRole('button',{name:'Not yet available: '+name})).toBeDisabled();
 const proceed=within(header).getByRole('button',{name:/Proceed to Wash 1/});expect(proceed).toHaveTextContent('7 candidates');
 fireEvent.click(screen.getByRole('button',{name:'Exclude VRT'}));expect(proceed).toHaveTextContent('6 candidates');
 const history=screen.getByText(/completed activity events/).textContent;
 within(nav).getByRole('button',{name:'View saved Thesis'}).focus();await userEvent.keyboard('{Enter}');
 expect(document.getElementById('saved-thesis')).toHaveFocus();expect(screen.getByText('Viewing saved Thesis · Research: Discovery')).toBeVisible();
 expect(scroll).toHaveBeenLastCalledWith({behavior:'instant',block:'start'});
 await userEvent.tab();await userEvent.keyboard('{Enter}');
 fireEvent.click(within(nav).getByRole('button',{name:'View saved Discovery'}));
 expect(document.getElementById('saved-discovery')).toHaveFocus();expect(screen.getByRole('region',{name:'Excluded by you'})).toHaveTextContent('VRT');
 expect(screen.getByText(/completed activity events/).textContent).toBe(history);
 fireEvent.click(screen.getByRole('button',{name:'Re-include VRT'}));expect(proceed).toHaveTextContent('7 candidates');
 fireEvent.click(proceed);expect(screen.getByRole('region',{name:'Wash 1 research canvas'})).toBeVisible();expect(screen.getByText('Viewing saved Wash 1 · Research: Wash 1')).toBeVisible();
 expect(within(nav).getByRole('button',{name:'Not yet available: Wash 2'})).toBeDisabled();expect(fetch).not.toHaveBeenCalled();media.mockRestore();fetch.mockRestore();
});

it('enables current Discovery during activity and keeps future stages blocked',async()=>{
 vi.spyOn(window,'matchMedia').mockReturnValue({matches:false} as MediaQueryList);
 render(<App/>);await userEvent.type(screen.getByRole('textbox'),'AI infrastructure{Enter}');
 await waitFor(()=>expect(screen.getByRole('button',{name:'Lock & begin research'})).toBeEnabled());fireEvent.click(screen.getByRole('button',{name:'Lock & begin research'}));
 expect(screen.getByRole('button',{name:'View saved Discovery'})).toBeEnabled();expect(screen.getByRole('button',{name:'Not yet available: Wash 1'})).toBeDisabled();expect(screen.queryByRole('button',{name:/Proceed to Wash 1/})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'View saved Thesis'}));expect(document.getElementById('saved-thesis')).toHaveFocus();
});
