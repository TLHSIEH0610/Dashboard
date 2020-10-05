let hello1 = (sname:string)=>{
    return `Hello ${sname}`
}

hello1('123')


let age: number = 123
let myname: string = 'fe'
let Isloading: boolean = true


let uuu: undefined = undefined
let nn: null = null

let avd: any = undefined

let anything: string | boolean = 'dw'

let array1: number[] = [123,333, 33,22]
let array2: string[] = ['eee']
let array3: [number, string, number?] = [123,'dee',12]

interface Person {
    age: number;
    name?: string;
    readonly id: string
}

let object:Person = {
    age:123,
    // name: 'deee'
    id: '140000'
}

function add(x:number, y:number, z:string = '1'):number {
    if (typeof z === 'string'){
        return x
    }
    return 1
}

let result = add(4,6)

const add1 :(x:number , y:number) => number = add