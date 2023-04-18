// posts için gerekli routerları buraya yazın
const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();


// 1 [GET] /api/posts
router.get('/', async (req, res) => {   //catch all

    try {
        const allPosts = await Posts.find();
        res.json(allPosts)

    } catch (error) {
        res.status(500).json({message: "Gönderiler alınamadı"})
    }

});

// 2 [GET] /api/posts/:id
router.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let postById = await Posts.findById(id);
        if (postById) {
            res.json(postById);
        }
        else {
            res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Gönderi bilgisi alınamadı" })
    }
});

// 3 [POST] /api/posts
router.post('/', async (req, res) => {
    try {
        let newPost = req.body;
        const {title, contents} = req.body;
        if (!title || !contents) {
            res.status(400).json({ message: "Lütfen gönderi için bir title ve contents sağlayın" })
        }
        else {
            let insertedId = await Posts.insert({title:title, contents: contents});
            const insertedPost = await Posts.findById(insertedId.id)
            res.status(201).json(insertedPost);
        }
    } catch (error) {
        res.status(500).json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
});

// 4 [PUT] /api/posts/:id
router.put('/:id', async (req, res) => {
    try {
        
        const postById = await Posts.findById(req.params.id);
        if (!postById) {                                                                               
            res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        }
        else {
            const {title, contents} = req.body;
            if (!title || !contents) {
                res.status(400).json({ message: "Lütfen gönderi için title ve contents sağlayın" })
            }
            else {
                await Posts.update(req.params.id, {title:title, contents: contents});
                const updatedPost = await Posts.findById(req.params.id)
                res.json(updatedPost);
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
    }
})

// 5 [DELETE] /api/posts/:id
router.delete('/:id', async (req, res) => {
    try {

        let postById = await Posts.findById(req.params.id);
        if (!postById) {
            res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        }
        else {
            let deletedPost = await Posts.remove(req.params.id);
            res.json(postById);
        }

    } catch (error) {
        res.status(500).json({ message: "Gönderi silinemedi" });
    }
});

//6 [GET] /api/posts/:id/comments
router.get('/:id/comments', async (req, res) => {
    try {

        let id = req.params.id;
        let post = await Posts.findById(id);
        
        if (!post) {
            res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." })
        }
        else {
            let comments = await Posts.findPostComments(id);
            res.json(comments);
        }

    } catch (error) {
        res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
    }
})


module.exports = router;