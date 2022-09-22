
const express = require("express");
const router = express.Router();
const {User,Post,PostMedia,Follow} = require("../models");




//게시글 가져 오기
// 모든 유저 게시물 const data = await Post.findAll({raw:true,include:[{model:PostMedia},{model:User,attributes:['nickName','email','profile']}]});
router.get("/",async(req,res) =>{
    if(req.isAuthenticated()){
        const arr=[];
        const list = []; 
        const FollowingList = await User.findAll({
            raw: true,
            attributes: ['id'],
            include: [{ model: User, as: 'followings', where: { id: req.user.id } }]
        }); // 자기가 팔로우하는 사람을 찾는 코드
        for (let i=0; i<FollowingList.length ;i++){
            const FollowingPost = await Post.findAll({
                raw:true,
                attributes:['content','createdAt','id'],
                where:{UserId: FollowingList[i].id},
                include: [{model:PostMedia,attributes:['createdAt','type','src']},{model:User,attributes:['id','nickName','profile']}]
            })
            FollowingPost.forEach(ele=>{
                arr.push(ele);
            });
        }// arr배열에 쿼리 결과를 담음
        arr.sort((a,b)=>{
            return b['Postmedia.createdAt'] - a['Postmedia.createdAt'];
        }); // 시간순 정렬
        for(let i =0;i<arr.length;i++){
            let flag = true;
            for(let j=0;j<list.length;j++){
                if(list[j].id==arr[i].id){
                    flag=false;
                    break;
                }
            }
            if(flag==false){
                list[list.length-1].src.push({src:arr[i]['Postmedia.src'],type:arr[i]['Postmedia.type']});
            }
            else{
                list.push(arr[i]);
                list[list.length-1].src=[{src:arr[i]['Postmedia.src'],type:arr[i]['Postmedia.type']}];
            }
        }
        for(let i=0;i<list.length;i++){
            delete list[i]['Postmedia.createdAt'];
            delete list[i]['Postmedia.type'];
            delete list[i]['Postmedia.src'];
        }
        // 데이터 가공
        /* 데이터 형식
        {   

            content: , 
            createdAt: ,
            'User.nickName': , 
            'User.profile': ,
            'User.id',
            src: [{src: , type},]
        }

        */
       console.log(list);
         res.render('main',{data:list});

          
    }
    else{
        res.redirect("/auth/login");
    }
})


module.exports = router;