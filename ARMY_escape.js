Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//////// Game Definition
function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	printMessage(welcome)
}
Game.end = function(){
	game.clear()
}
Game.move = function(room){
	game.move(room.id)	
}
Game.handItem = function(){
	return game.getHandItem()
}
Game.Combination = function(a, b, c){
	game.makeCombination(a, b, c)
}


//////// Room Definition

function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})

//////// Object Definition

function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){
	this.id.show()
})
Object.member('hide', function(){
	this.id.hide()
})
Object.member('open', function(){
	this.id.open()
})
Object.member('close', function(){
	this.id.close()
})
Object.member('lock', function(){
	this.id.lock()
})
Object.member('unlock', function(){
	this.id.unlock()
})
Object.member('isOpened', function(){
	return this.id.isOpened()
})
Object.member('isClosed', function(){
	return this.id.isClosed()
})
Object.member('isLocked', function(){
	return this.id.isLocked()
})
Object.member('pick', function(){
	this.id.pick()
})
Object.member('isPicked', function(){
	return this.id.isPicked()
})
Object.member('this', function(){
	return this.id
})
Object.member('isHanded', function(){
	return Game.handItem() == this.id
})

//////// Door Definition

function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
})
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})


//////// Keypad Definition

function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})


//////// DoorLock Definition
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}
// inherited from Object
DoorLock.prototype = new Keypad()

/////// Item Definition

function Item(room, name, image){
	Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})

playSound("frontline.wav") // 멸공의 횃불 재생

room1 = new Room('room1', 'room1.png')		// 변수명과 이름이 일치해야 한다.
room2 = new Room('room2', 'room2.png')		
room3 = new Room('room3', 'room3.png')		
room4 = new Room('room4', 'room4.png')		
room5 = new Room('room5', 'room5.png')
//
room6 = new Room('room6', 'room6.jpg')
room7 = new Room('room7', 'room7.jpg')
room8 = new Room('room8', 'room8.jpg')
room9 = new Room('room9', 'room9.jpg')

room6.target_100 = new Object(room6, 'target_100', 'target.png')
room6.target_100.resize(40)
room6.target_100.locate(660, 410)

room6.target_200 = new Object(room6, 'target_200', 'target.png')
room6.target_200.resize(30)
room6.target_200.locate(660, 350)

room6.target_250 = new Object(room6, 'target_250', 'target.png')
room6.target_250.resize(20)
room6.target_250.locate(660, 300)

room6.gun = new Object(room6, 'gun', 'gun.png')
room6.gun.resize(400)
room6.gun.locate(630,580)
room6.gun.hide()
room6.gun_down = new Object(room6, 'gun_down', 'gun_down.png')
room6.gun_down.resize(600)
room6.gun_down.locate(300, 560)
room6.gun_down.onClick = function(){
	room6.gun_down.hide()
	room6.gun.show()
	room6.start.show()
}

room6.up = new Object(room6, 'up', 'up.png')
room6.up.resize(100)
room6.up.locate(1200,200)

room6.down = new Object(room6, 'down', 'down.png')
room6.down.resize(100)
room6.down.locate(1200,300)

var target = [room6.target_100, room6.target_200, room6.target_250]
TargetHide()

var result = 0
var cur_target = -1
room6.start = new Object(room6, 'start', 'start.png')
room6.start.resize(150)
room6.start.locate(1200,400)

room6.shoot = new Object(room6, 'shoot', 'shoot.png')
room6.shoot.resize(150)
room6.shoot.locate(1200,450)


room6.up.hide()
room6.down.hide()
room6.start.hide()
room6.shoot.hide()

room6.start.onClick = function() {
	result = Math.floor(Math.random() * 3)
	cur_target = result
	target[result].show()
	room6.start.hide()
	room6.up.show()
	room6.down.show()
	room6.score2.show()
	room6.score_sub.show()
	room6.shoot.show()
}

room6.up.onClick = function(){
	if(room6.gun.getY() > 400)
		room6.gun.move(0, -60)
}

room6.down.onClick = function(){
	if(room6.gun.getY() < 520)
		room6.gun.move(0, 60)
}


room6.back = new Door (room6, 'back', 'back.png', 'back.png', room7)
room6.back.resize(100)
room6.back.locate(200, 600)
room6.back.hide()

room6.back.onClick = function(){
	printMessage("잃어버린 탄피를 어서 찾아보자.")
	Game.move(this.connectedTo)
	playSound("woosh.wav")
}

var target_Y_list = [520, 460, 400]

room6.shoot.onClick = function(){

	if(room6.gun.getY() == target_Y_list[cur_target])
	{
		ShowScore(++score_cnt, room6.score2)
		if(score_cnt == 10)
		{	
			playSound("target_hit.wav")
			printMessage("사 격 종 료. 화살표를 누르세요.")
			room6.score2.hide()
			room6.score_sub.hide()
			target[result].hide()
			room6.gun.hide()
			room6.up.hide()
			room6.down.hide()
			room6.shoot.hide()
			room6.back.show()
		}
		else
		{
			playSound("target_hit.wav")
			target[result].hide()
			result = Math.floor(Math.random() * 3)
			cur_target = result
			target[result].show()
		}
	}
	else
	{
		playSound("rifle_shot.wav")
	}

}
function TargetHide()
{
	for(var i=0; i<3; i++)
	{
		target[i].hide()
	}
}

room6.score2 = new Object(room6, 'score2', '0.png')
room6.score2.resize(50)
room6.score2.locate(1100, 660)

room6.score2.hide()

room6.score_sub = new Object(room6, 'score_sub', 'ten.png')
room6.score_sub.resize(90)
room6.score_sub.locate(1170, 660)
room6.score_sub.hide()

var score_cnt = 0

function ShowScore(cnt, icon)
{
	var temp = cnt % 10

	var text1 = String(temp)
	var text2 = ".png"

	icon.setSprite(text1.concat(text2))
}

room7.bullet = new Object(room7, 'bullet', 'bullet.png')
room7.bullet.resize(50)
room7.bullet.locate(Math.floor(Math.random() * 800) + 200, 50)

room7.back = new Door (room7, 'back', 'back.png', 'back.png', room8)
room7.back.resize(100)
room7.back.locate(200, 600)
room7.back.hide()

room7.bullet.onClick = function(){
	printMessage("잃어버린 탄피를 찾았다. 화살표를 눌러 다시 돌아가자.")
	room7.back.show()
	room7.bullet.hide()
}

room8.suit = new Item(room8, 'suit', 'suit.png')
room8.suit.resize(200)
room8.suit.locate(300, 350)


room8.gate = new Door(room8, 'gate', 'gate_closed.png', 'gate_open.png', room9)
room8.gate.resize(600)
room8.gate.locate(900, 300)

room8.gate.onClick = function(){
	if(!room8.suit.isHanded())
	{
		printMessage("우선 화생방 보호의를 입자...")
	}
	else if (room8.suit.isHanded() && !this.id.isLocked() && this.id.isClosed())
	{
		printMessage("활 짝!")
		this.id.open()
	}
	else
		Game.move(this.connectedTo)
}

room9.smoke = new Object(room9, 'smoke', 'smoke.png')
room9.smoke.resize(1700)
room9.smoke.locate(800, 450)
room9.smoke.onClick = function()
{
	if(room9.gas_mask_real.isHanded())
	{
		room9.smoke.hide()
		printMessage("이제 시야가 보이는 것 같다.")
	}
	else
	{
		printMessage("일단 방독면과 정화통을 결합하자. 말할 시간도 없다.")
	}
}


room9.gas_mask = new Object(room9, 'gas_mask', 'gas_mask.png')
room9.gas_mask.resize(50)
room9.gas_mask.locate(550, 330)

room9.gas_mask_sub = new Object(room9, 'gas_mask_sub', 'gas_mask_sub.png')
room9.gas_mask_sub.resize(50)
room9.gas_mask_sub.locate(100,500)

room9.gas_mask_real = new Object(room9, 'gas_mask_real', 'gas_mask_real.png')
room9.gas_mask_real.hide()

room9.gas_mask.onClick = function() {
	room9.gas_mask.pick()
}

room9.gas_mask_sub.onClick = function() {
	room9.gas_mask_sub.pick()
}

game.makeCombination(room9.gas_mask.this(), room9.gas_mask_sub.this(), room9.gas_mask_real.this())

//
room1.door1 = new Door(room1, 'door1', 'door01_closed.png', 'door01_open.png', room2)
room1.door1.resize(170)
room1.door1.locate(150, 450)


// 태극기
room1.taegukki = new Object(room1, 'taegukki', 'taegukki.png')
room1.taegukki.resize(130)
room1.taegukki.locate(150,150)

room1.taegukki.onClick = function(){
    showImageViewer("taegukki_origin.png");
    printMessage('아! 나의 조국! 볼 때마다 벅차오른다!')
}

// 복무신조
room1.bokmu = new Object(room1, 'bokmu', 'bokmu.png')
room1.bokmu.resize(65)
room1.bokmu.locate(400,300)

room1.bokmu.onClick = function(){
    showImageViewer("bokmu_origin.jpg");
	printMessage("우리의 결의!")
}

// 휴지통
room1.trashbin = new Object(room1, 'trashbin', 'trashbin.png')
room1.trashbin.resize(100)
room1.trashbin.locate(300,550)

room1.trashbin.onClick = function(){
    printMessage("쓰레기통은 비어있다")
}

// 스위치
room1.light_switch = new Object(room1, 'light_switch', 'light_switch.png')
room1.light_switch.resize(20)
room1.light_switch.locate(270,400)

room1.light_switch.onClick = function(){
    printMessage("딸깍")
}

// 침대 01
room1.bed1 = new Object(room1, 'bed1', 'bed01.png')
room1.bed1.resize(280)
room1.bed1.locate(500,490)

// 관물대 01
room1.gwanmuldae1 = new Object(room1, 'gwanmuldae1', 'gwanmuldae01.png')
room1.gwanmuldae1.resize(160)
room1.gwanmuldae1.locate(700,400)

room1.gwanmuldae1.onClick = function(){
    printMessage("최현진 일병의 관물대다")
}

// 침대 02
room1.bed2 = new Object(room1, 'bed2', 'bed02.png')
room1.bed2.resize(280)
room1.bed2.locate(780,510)

// 관물대 02
room1.gwanmuldae2 = new Object(room1, 'gwanmuldae2', 'gwanmuldae02.png')
room1.gwanmuldae2.resize(180)
room1.gwanmuldae2.locate(950,420)
room1.gwanmuldae2.STATUS = 2

room1.gwanmuldae2.onClick = function(){
	if(room1.gwanmuldae2.STATUS == 2){
		printMessage("박성규 상병의 관물대다, 자물쇠로 굳게 잠겨있다")
		showImageViewer("gwanmulmemo.png")
	}else{
		printMessage("텅 비어있다...")
	}
}

// 관물대 자물쇠
room1.lock = new Keypad(room1, 'lock', 'lock.png', '4231', function(){
	printMessage("철컹")
	playSound("door_open.wav")
	room1.gwanmuldae2.STATUS = 1
})
room1.lock.resize(15)
room1.lock.locate(915,505)

room1.lock.onClick = function(){
	printMessage("박성규의 메모를 다시한 번 살펴볼까?")
	showKeypad('number', this.password, this.callback)
}

// 침대 03
room1.bed3 = new Object(room1, 'bed3', 'bed03.png')
room1.bed3.resize(250)
room1.bed3.locate(1080,530)

// 관물대 03
room1.gwanmuldae3 = new Object(room1, 'gwanmuldae3', 'gwanmuldae03.png')
room1.gwanmuldae3.resize(190)
room1.gwanmuldae3.locate(1290,430)

room1.gwanmuldae3.onClick = function(){
    printMessage("내 관물대다")
}

room1.door1.onClick = function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
		playSound("door_open.wav")
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
}

room2.door1 = new Door(room2, 'door1', 'door02_closed.png', 'door02_open.png', room1)
room2.door1.resize(120)
room2.door1.locate(170, 455)

room2.door1.onClick = function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
		playSound("door_open.wav")
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
}


room2.door2 = new Door(room2, 'door2', 'door03_closed.png', 'door03_open.png', room3)
room2.door2.resize(40)
room2.door2.locate(900, 410)

room2.door2.onClick = function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
		playSound("door_open.wav")
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
}

// 생활관 팻말
room2.dorm = new Object(room2, 'dorm', 'dorm.png')
room2.dorm.resize(150)
room2.dorm.locate(120,240)

// 행정반 팻말
room2.admini = new Object(room2, 'admini', 'admini.png')
room2.admini.resize(50)
room2.admini.locate(900,280)

// 그린 보드
room2.greenboard = new Object(room2, 'greenboard', 'greenboard.png')
room2.greenboard.resize(250)
room2.greenboard.locate(1150,330)

// 보안 포스터
room2.rok_boan = new Object(room2, 'rok_boan', 'rok_boan.png')
room2.rok_boan.resize(20)
room2.rok_boan.locate(1050,350)

room2.rok_boan.onClick = function(){
    showImageViewer("rok_boan_origin.jpg");
	printMessage("흔해빠진 보안 포스터다")
}

// 부사관 포스터
room2.sergent = new Object(room2, 'sergent', 'sergent.png')
room2.sergent.resize(24)
room2.sergent.locate(1080,350)

room2.sergent.onClick = function(){
    showImageViewer("sergent_origin.jpg");
	printMessage("끔찍하다")
}

// 부사관 포스터2
room2.sergent2 = new Object(room2, 'sergent2', 'sergent2.png')
room2.sergent2.resize(28)
room2.sergent2.locate(1115,345)

room2.sergent2.onClick = function(){
    showImageViewer("sergent2_origin.jpg");
	printMessage("끔찍하다2")
}

// 식단표
room2.meal_table = new Object(room2, 'meal_table', 'meal_table.png')
room2.meal_table.resize(70)
room2.meal_table.locate(1200,335)

room2.meal_table.onClick = function(){
    showImageViewer("meal_table_origin.jpg");
	printMessage("고순튀...")
}

// 소화기
room2.fireex = new Object(room2, 'fireex', 'fireex.png')
room2.fireex.resize(100)
room2.fireex.locate(150,630)

// 소화기2
room2.fireex2 = new Object(room2, 'fireex2', 'fireex2.png')
room2.fireex2.resize(30)
room2.fireex2.locate(860,500)

// 화살표
room2.arrow = new Door (room2, 'arrow', 'arrow.png', 'arrow.png', room4)
room2.arrow.resize(130)
room2.arrow.locate(620,660)

room2.arrow.onClick = function(){
	Game.move(this.connectedTo)
	playSound("woosh.wav")
}

// 화살표 2
room4.arrow2 = new Door (room4, 'arrow2', 'arrow.png', 'arrow.png', room2)
room4.arrow2.resize(130)
room4.arrow2.locate(620,660)

room4.arrow2.onClick = function(){
	Game.move(this.connectedTo)
	playSound("woosh.wav")
}

// 천국으로 가는 문
room4.heaven = new Door(room4, 'heaven', 'heaven.png', 'heaven.png')
room4.heaven.resize(685)
room4.heaven.locate(623, 307)

// 전역증
room3.retire = new Item(room3, 'retire', 'retire.jpg')
room3.retire.resize(50)
room3.retire.locate(445, 600)
room3.retire.hide()

// 종결조건
room4.heaven.onClick = function(){
	if (!room3.retire.isHanded()){
		printMessage("??? : 전역증을 가져오너라...")
	}
	else if (room3.retire.isHanded() && !this.id.isLocked() && this.id.isClosed()){
		printMessage("??? : 전역증을 가져왔군... 클릭을 한번 더해서 밖으로 나가거라")
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
}

// 
room3.door2 = new Door(room3, 'door2', 'door04_closed.png', 'door04_open.png', room2)
room3.door2.resize(195)
room3.door2.locate(230, 405)

room3.door2.onClick = function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
		playSound("door_open.wav")
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
}

// 캐비넷
room3.cabinet = new Object(room3, 'cabinet', 'cabinet.png')
room3.cabinet.resize(150)
room3.cabinet.locate(420,380)
room3.cabinet.STATUS = 2

room3.cabinet.onClick = function(){
	if(room3.cabinet.STATUS == 2){
		printMessage("잠겨있다!")
	}else{
		printMessage("뭐가 떨어졌다. 혹시...!")
		playSound("drop.wav")
		room3.retire.show()
	}
}

// 자물쇠
room3.lock = new Keypad(room3, 'lock', 'lock.png', '2048', function(){
	printMessage("철커덩")
	playSound("door_open.wav")
	room3.cabinet.STATUS = 1
})
room3.lock.resize(20)
room3.lock.locate(420,300)

room3.lock.onClick = function(){
	printMessage("아마 중대장님의 컴퓨터에 적혀있지 않을까...")
	showKeypad('number', this.password, this.callback)
}


// 화분
room3.plant = new Object(room3, 'plant', 'plant.png')
room3.plant.resize(80)
room3.plant.locate(800,450)

room3.plant.onClick = function(){
	printMessage("중대장님이 아끼는 화분이다")
}

// 화살표 3
room3.arrow3 = new Door (room3, 'arrow3', 'arrow_left.png', 'arrow_left.png', room5)
room3.arrow3.resize(150)
room3.arrow3.locate(1100,650)

room3.arrow3.onClick = function(){
	Game.move(this.connectedTo)
	playSound("woosh.wav")
}

// 화살표 4
room5.arrow4 = new Door (room5, 'arrow4', 'arrow_right.png', 'arrow_right.png', room3)
room5.arrow4.resize(150)
room5.arrow4.locate(200,650)

room5.arrow4.onClick = function(){
	Game.move(this.connectedTo)
	playSound("woosh.wav")
}

// 인사계원 테이블
room5.calender_table = new Object(room5, 'calender_table', 'calender_table.png')
room5.calender_table.resize(100)
room5.calender_table.locate(250,410)

room5.calender_table.onClick = function(){
	printMessage("인사계원의 달력이다")
	showImageViewer("calender.jpg")
}

// 소대장 컴퓨터
room5.com_insa = new Object(room5, 'com_insa', 'com_insa.png')
room5.com_insa.resize(100)
room5.com_insa.locate(500,350)

room5.com_insa.onClick = function(){
	printMessage("소대장의 컴퓨터다. 고장난거 같다")
}

// 중대장 컴퓨터
room5.com_jung = new Object(room5, 'com_jung', 'com_jung.png')
room5.com_jung.resize(150)
room5.com_jung.locate(1000,415)
room5.com_jung.STATUS = 2 // 화면 닫힘

room5.com_jung.onClick = function(){
	if(room5.com_jung.STATUS == 2){
		printMessage("중대장의 컴퓨터다. 옆의 본체를 한번 봐볼까..")
		showImageViewer("monitor_blank.png")
	}else{
		printMessage("흠.")
		showImageViewer("monitor_on.png")
	}
}

// 중대장 컴퓨터 본체
room5.computer = new Keypad(room5, 'computer', 'computer.png', '0723', function(){
	printMessage("위잉~")
	playSound("startup.wav")
	room5.com_jung.STATUS = 1 // 화면 열림
})
room5.computer.resize(100)
room5.computer.locate(1200,430)

room5.computer.onClick = function(){
	printMessage("본체가 자물쇠로 잠겨있다")
	showKeypad('number', this.password, this.callback)
}

/*
room2.door2 = new Door(room2, 'door2', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room3)
room2.door2.resize(120)
room2.door2.locate(1000, 305)
room2.door2.hide()
*/

/*
room2.keypad1 = new Keypad(room2, 'keypad1', '키패드-우.png', '1234', function(){
	printMessage('스르륵 문이 보인다')
	room2.door2.show()
})
room2.keypad1.resize(20)
room2.keypad1.locate(920, 250)

// onClick 함수를 재정의할 수도 있다
room2.keypad1.onClick = function(){
	printMessage('1234')
	showKeypad('number', this.password, this.callback)
}
*/

/*
room3.door1 = new Door(room3, 'door1', '문-왼쪽-닫힘.png', '문-왼쪽-열림.png', room2)
room3.door1.resize(120)
room3.door1.locate(300, 297)

room3.door2 = new Door(room3, 'door2', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png')
room3.door2.resize(120)
room3.door2.locate(1000, 313)
room3.door2.lock()

room3.lock1 = new DoorLock(room3, 'lock1', '키패드-우.png', '1234', room3.door2, '철커덕')
room3.lock1.resize(20)
room3.lock1.locate(920, 250)
*/

Game.start(room6, '전역증을 잃어버렸다! 전역증을 찾아 군대를 탈출해라!')